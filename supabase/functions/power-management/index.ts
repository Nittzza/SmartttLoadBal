
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

    console.log("[Power Management] Function invoked, analyzing power consumption...")

    // Fetch current power monitoring configuration
    const { data: powerConfig, error: configError } = await supabase
      .from('power_monitoring')
      .select('*')
      .single()

    if (configError) {
      console.error("[Power Management] Config fetch error:", configError)
      throw configError
    }

    // Only proceed if auto management is enabled
    if (!powerConfig.auto_management_enabled) {
      console.log("[Power Management] Auto management is disabled, skipping power check")
      return new Response(JSON.stringify({
        status: 'skipped',
        message: 'Auto management is disabled'
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Fetch all active devices and their power consumption
    const { data: devices, error: devicesError } = await supabase
      .from('devices')
      .select('id, plug_name, power_max, status, priority, location')
      .eq('status', 'active')

    if (devicesError) {
      console.error("[Power Management] Devices fetch error:", devicesError)
      throw devicesError
    }

    console.log(`[Power Management] Found ${devices.length} active devices`)

    // Calculate total power consumption
    const totalPower = devices.reduce((sum, device) => 
      sum + (Number(device.power_max) || 0), 0)
    
    console.log(`[Power Management] Total power consumption: ${totalPower}W, Threshold: ${powerConfig.total_power_threshold}W`)

    // Check for overload
    const isOverloaded = totalPower > powerConfig.total_power_threshold
    const powerUsagePercentage = (totalPower / powerConfig.total_power_threshold) * 100

    if (isOverloaded && powerConfig.auto_management_enabled) {
      console.log(`[Power Management] OVERLOAD detected: ${totalPower}W / ${powerConfig.total_power_threshold}W (${powerUsagePercentage.toFixed(1)}%)`)
      
      // Priority weights for sorting (higher number = higher priority to keep running)
      const priorityWeight = { 'low': 1, 'medium': 2, 'high': 3 }
      
      // Sort devices by priority (low priority first to be turned off)
      // Within same priority, sort by power consumption (highest first)
      const sortedDevices = [...devices].sort((a, b) => {
        const aPriority = priorityWeight[a.priority || 'low'] || 1
        const bPriority = priorityWeight[b.priority || 'low'] || 1
        
        if (aPriority !== bPriority) {
          return aPriority - bPriority // Lower priority first (to be turned off)
        }
        
        return (Number(b.power_max) || 0) - (Number(a.power_max) || 0)
      })

      // Calculate how much power we need to reduce
      const targetPower = powerConfig.total_power_threshold * 0.9 // Target 90% of threshold
      let currentPower = totalPower
      const devicesToTurnOff = []

      // Turn off devices until we're under target power
      for (const device of sortedDevices) {
        if (currentPower <= targetPower) break
        
        const devicePower = Number(device.power_max) || 0
        console.log(`[Power Management] Turning off ${device.plug_name || device.id} (${devicePower}W, Priority: ${device.priority || 'low'})`)
        
        // Update device status
        const { error: updateError } = await supabase
          .from('devices')
          .update({ 
            status: 'inactive',
            last_active: new Date().toISOString()
          })
          .eq('id', device.id)

        if (!updateError) {
          devicesToTurnOff.push({
            id: device.id,
            name: device.plug_name || `Device ${device.id}`,
            power: devicePower,
            priority: device.priority || 'low',
            location: device.location
          })
          currentPower -= devicePower
        } else {
          console.error(`[Power Management] Failed to update device ${device.id}:`, updateError)
        }
      }

      // Log overload event
      await supabase
        .from('overload_events')
        .insert({
          total_power: totalPower,
          threshold: powerConfig.total_power_threshold,
          devices_active: devices,
          action_taken: `Turned off ${devicesToTurnOff.length} devices`,
          power_reduction: totalPower - currentPower
        })
      
      // Update power monitoring status
      await supabase
        .from('power_monitoring')
        .update({ 
          current_load: currentPower,
          is_overloaded: currentPower > powerConfig.total_power_threshold,
          last_overload: new Date().toISOString(),
          last_check: new Date().toISOString()
        })
        .eq('id', powerConfig.id)

      return new Response(JSON.stringify({
        status: 'overload_managed',
        originalPower: totalPower,
        currentPower: currentPower,
        devicesDisabled: devicesToTurnOff,
        message: `Turned off ${devicesToTurnOff.length} devices to reduce power from ${totalPower}W to ${currentPower}W`
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // Update power monitoring without overload actions
    await supabase
      .from('power_monitoring')
      .update({ 
        current_load: totalPower,
        is_overloaded: false,
        last_check: new Date().toISOString()
      })
      .eq('id', powerConfig.id)

    console.log(`[Power Management] Normal operation: ${totalPower}W / ${powerConfig.total_power_threshold}W (${powerUsagePercentage.toFixed(1)}%)`)

    return new Response(JSON.stringify({
      status: powerUsagePercentage > 70 ? 'elevated' : 'normal',
      totalPower,
      usagePercentage: powerUsagePercentage,
      activeDevices: devices.length
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error) {
    console.error('[Power Management] Error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to process power management',
      details: error.message 
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
