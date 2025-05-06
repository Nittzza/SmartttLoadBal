
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, params } = await req.json()
    console.log(`Power utils function called with action: ${action}`, params);

    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Enable realtime for the power_monitoring and devices tables
    try {
      await supabaseClient.rpc('supabase_realtime.enable_publication', {
        publication_name: 'supabase_realtime'
      });
      
      // Enable full replica identity for power_monitoring table
      await supabaseClient
        .from('power_monitoring')
        .update({ replica_identity: 'full' })
        .eq('id', '1');
      
      // Enable full replica identity for devices table
      await supabaseClient
        .from('devices')
        .update({ replica_identity: 'full' })
        .eq('id', '1');
    } catch (err) {
      // It's okay if these calls fail - the publication might already be enabled
      console.log('Realtime setup error (non-critical):', err.message);
    }

    // Handle different actions
    switch (action) {
      case 'get_power_monitoring':
        return await getPowerMonitoring(supabaseClient)

      case 'toggle_power_auto_management':
        return await togglePowerAutoManagement(supabaseClient, params)
        
      case 'set_test_overload':
        return await setTestOverload(supabaseClient, params)

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in power-utils function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function getPowerMonitoring(supabaseClient) {
  console.log('Getting power monitoring data');

  // First check if we have a power_monitoring record
  const { data: powerData, error: powerError } = await supabaseClient
    .from('power_monitoring')
    .select('*')
    .order('id', { ascending: true })
    .limit(1)
    .single()

  // If no record exists, create a default one
  if (powerError && powerError.code === 'PGRST116') {
    console.log('No power monitoring record found, creating default one')
    const { data: newData, error: insertError } = await supabaseClient
      .from('power_monitoring')
      .insert({
        total_power_threshold: 2000,
        current_load: 0,
        is_overloaded: false,
        last_check: new Date().toISOString(),
        auto_management_enabled: false
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating default power monitoring record:', insertError);
      throw insertError
    }

    console.log('Created new power monitoring record:', newData);
    return new Response(
      JSON.stringify(newData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (powerError) {
    console.error('Error fetching power monitoring:', powerError);
    throw powerError
  }

  // Calculate the current power load from active devices
  const { data: devices, error: devicesError } = await supabaseClient
    .from('devices')
    .select('power_max, status')
    .eq('status', 'active')

  if (devicesError) {
    console.error('Error fetching devices:', devicesError);
    throw devicesError
  }

  // Calculate total power from active devices
  const totalPower = devices && devices.length > 0
    ? devices.reduce((sum, device) => sum + (Number(device.power_max) || 0), 0)
    : 0

  console.log(`Current power load: ${totalPower}W, Threshold: ${powerData.total_power_threshold}W`);

  // Update the power monitoring record with the current load
  const isOverloaded = totalPower > powerData.total_power_threshold
  await supabaseClient
    .from('power_monitoring')
    .update({
      current_load: totalPower,
      is_overloaded: isOverloaded,
      last_check: new Date().toISOString(),
      last_overload: isOverloaded ? new Date().toISOString() : powerData.last_overload
    })
    .eq('id', powerData.id)

  // Return the updated data
  const updatedData = {
    ...powerData,
    current_load: totalPower,
    is_overloaded: isOverloaded,
    last_check: new Date().toISOString(),
    last_overload: isOverloaded ? new Date().toISOString() : powerData.last_overload
  }

  console.log('Returning updated power monitoring data:', updatedData);
  return new Response(
    JSON.stringify(updatedData),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function togglePowerAutoManagement(supabaseClient, params) {
  const { power_id, new_status } = params
  console.log(`Toggling power auto management to ${new_status} for ID ${power_id}`);

  const { error } = await supabaseClient
    .from('power_monitoring')
    .update({ auto_management_enabled: new_status })
    .eq('id', power_id)

  if (error) {
    console.error('Error toggling auto management:', error);
    throw error
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function setTestOverload(supabaseClient, params) {
  const { deviceCount = 5, powerPerDevice = 500 } = params
  
  console.log(`Setting up test overload with ${deviceCount} devices at ${powerPerDevice}W each`);
  
  // First, get some devices to update
  const { data: devices, error: devicesError } = await supabaseClient
    .from('devices')
    .select('id')
    .limit(deviceCount);
  
  if (devicesError) {
    console.error('Error fetching devices:', devicesError);
    throw devicesError;
  }
  
  if (!devices || devices.length === 0) {
    return new Response(
      JSON.stringify({ error: 'No devices found to update' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )
  }
  
  // Update the devices with high power and active status
  const deviceIds = devices.map(d => d.id);
  const { error: updateError } = await supabaseClient
    .from('devices')
    .update({ 
      power_max: powerPerDevice,
      status: 'active'
    })
    .in('id', deviceIds);
  
  if (updateError) {
    console.error('Error updating devices:', updateError);
    throw updateError;
  }
  
  // Calculate the total power that was set
  const totalPowerSet = deviceCount * powerPerDevice;
  
  // Update the power_monitoring table to reflect the new load
  const { error: monitoringError } = await supabaseClient
    .from('power_monitoring')
    .update({
      current_load: totalPowerSet,
      is_overloaded: totalPowerSet > 2000,  // Assuming 2000W threshold
      last_check: new Date().toISOString(),
      last_overload: totalPowerSet > 2000 ? new Date().toISOString() : null
    })
    .eq('id', '1');  // Assuming only one record
  
  if (monitoringError) {
    console.error('Error updating power monitoring:', monitoringError);
    throw monitoringError;
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Updated ${deviceIds.length} devices to ${powerPerDevice}W each (${totalPowerSet}W total)`,
      devices: deviceIds,
      totalPower: totalPowerSet,
      isOverloaded: totalPowerSet > 2000
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
