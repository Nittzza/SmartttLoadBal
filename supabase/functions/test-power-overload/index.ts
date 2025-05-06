
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Extract parameters or use defaults
    let power = 3000
    let threshold = 2000
    let isOverloaded = true
    
    try {
      const { power_value, threshold_value, overloaded } = await req.json()
      if (power_value) power = parseInt(power_value)
      if (threshold_value) threshold = parseInt(threshold_value)
      if (overloaded !== undefined) isOverloaded = overloaded
    } catch (e) {
      // Use defaults if body parsing fails
    }

    console.log(`Setting power to ${power}, threshold ${threshold}, overloaded: ${isOverloaded}`)
    
    // Enable realtime publishing for the table
    try {
      await supabase.rpc('supabase_realtime.enable_publication', {
        publication_name: 'supabase_realtime',
        table_name: 'power_monitoring'
      })
    } catch (err) {
      console.log('Note: Realtime already enabled or failed to enable:', err.message)
    }
    
    try {
      // Execute raw SQL to set replica identity to FULL
      await supabase.rpc('alter_table_replica_identity', { 
        table_name: 'power_monitoring',
        identity_type: 'FULL'
      }).catch(e => console.log('Replica identity setting skipped:', e.message))
    } catch (err) {
      console.log('Failed to set replica identity:', err)
    }
    
    // Update the power monitoring record
    const { data, error } = await supabase
      .from('power_monitoring')
      .update({ 
        current_load: power,
        total_power_threshold: threshold,
        is_overloaded: isOverloaded,
        last_check: new Date().toISOString(),
        last_overload: isOverloaded ? new Date().toISOString() : null
      })
      .eq('id', '1')  // Use actual ID if different
      .select()
    
    if (error) throw error
    
    return new Response(JSON.stringify({
      message: "Power monitoring updated",
      new_values: {
        power,
        threshold,
        isOverloaded
      },
      data
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error) {
    console.error('Error in test function:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to update power monitoring',
      details: error.message 
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
