
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PowerMonitoringData {
  id: string;
  total_power_threshold: number;
  current_load: number;
  is_overloaded: boolean;
  last_check: string;
  last_overload: string | null;
  auto_management_enabled: boolean;
}

export interface DisabledDevice {
  id: string;
  name: string;
  power: number;
  priority: string;
  location?: string;
}

export const usePowerMonitoring = () => {
  const [powerConfig, setPowerConfig] = useState<PowerMonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerLoading, setTriggerLoading] = useState(false);

  const fetchPowerMonitoring = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching power monitoring data...');
      const { data, error } = await supabase.functions.invoke('power-utils', {
        body: { action: 'get_power_monitoring' }
      });

      if (error) throw error;
      
      console.log('Power data received:', data);
      
      if (data) {
        setPowerConfig(data as PowerMonitoringData);
      } else {
        setPowerConfig({
          id: 'default',
          total_power_threshold: 2000,
          current_load: 0,
          is_overloaded: false,
          last_check: new Date().toISOString(),
          last_overload: null,
          auto_management_enabled: false
        });
        
        toast({
          title: 'Using Default Settings',
          description: 'No power monitoring configuration found. Using default values.',
        });
      }
    } catch (error) {
      console.error('Error fetching power monitoring:', error);
      setError('Failed to load power monitoring data');
      toast({
        title: 'Error',
        description: 'Could not fetch power monitoring data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoManagement = async () => {
    if (!powerConfig) return;
    
    try {
      const { error } = await supabase.functions.invoke('power-utils', {
        body: { 
          action: 'toggle_power_auto_management', 
          params: {
            power_id: powerConfig.id,
            new_status: !powerConfig.auto_management_enabled
          }
        }
      });

      if (error) throw error;
      
      setPowerConfig({
        ...powerConfig,
        auto_management_enabled: !powerConfig.auto_management_enabled
      });
      
      toast({
        title: 'Power Management',
        description: !powerConfig.auto_management_enabled 
          ? 'Automatic power management enabled' 
          : 'Automatic power management disabled'
      });
    } catch (error) {
      console.error('Error updating power management:', error);
      toast({
        title: 'Error',
        description: 'Could not update power management settings',
        variant: 'destructive'
      });
    }
  };

  const triggerPowerManagement = async () => {
    try {
      setTriggerLoading(true);
      
      const { data, error } = await supabase.functions.invoke('power-management', {});
      
      if (error) throw error;
      
      await fetchPowerMonitoring();
      
      if (data?.status === 'overload_managed') {
        let devicesText = '';
        if (data.devicesDisabled && Array.isArray(data.devicesDisabled)) {
          devicesText = `Turned off ${data.devicesDisabled.length} devices to reduce power consumption.`;
        }
        
        toast({
          title: 'Power Overload Managed',
          description: `${data.message || ''}. ${devicesText}`,
          variant: 'destructive'
        });
      } else if (data?.status === 'skipped') {
        toast({
          title: 'Auto Management Disabled',
          description: 'Enable auto management to allow automatic device control during overload.',
          variant: 'default'
        });
      } else {
        toast({
          title: 'Power Check Complete',
          description: `System is operating normally at ${data?.usagePercentage?.toFixed(1) || 0}% capacity`,
          variant: 'default'
        });
      }
      
    } catch (error) {
      console.error('Error triggering power management:', error);
      toast({
        title: 'Error',
        description: 'Could not trigger power management check',
        variant: 'destructive'
      });
    } finally {
      setTriggerLoading(false);
    }
  };

  // Update power usage based on active devices
  const updatePowerUsage = async () => {
    try {
      console.log('Calculating current power usage from active devices...');
      
      // Get active devices
      const { data: devices, error: devicesError } = await supabase
        .from('devices')
        .select('power_max, status')
        .eq('status', 'active');
        
      if (devicesError) {
        console.error('Error fetching devices:', devicesError);
        return;
      }
      
      // Calculate total power consumption
      if (devices && devices.length > 0) {
        const totalPower = devices.reduce((sum, device) => sum + (Number(device.power_max) || 0), 0);
        console.log(`Total power from active devices: ${totalPower}W`);
        
        if (powerConfig) {
          const isOverloaded = totalPower > powerConfig.total_power_threshold;
          console.log(`Is overloaded: ${isOverloaded} (${totalPower}W > ${powerConfig.total_power_threshold}W)`);
          
          // Update the power_monitoring table
          const { error: updateError } = await supabase
            .from('power_monitoring')
            .update({ 
              current_load: totalPower,
              is_overloaded: isOverloaded,
              last_check: new Date().toISOString(),
              last_overload: isOverloaded ? new Date().toISOString() : powerConfig.last_overload
            })
            .eq('id', powerConfig.id);
            
          if (updateError) {
            console.error('Error updating power monitoring:', updateError);
            return;
          }
          
          // Also update local state for immediate UI feedback
          setPowerConfig({
            ...powerConfig,
            current_load: totalPower,
            is_overloaded: isOverloaded,
            last_check: new Date().toISOString(),
            last_overload: isOverloaded ? new Date().toISOString() : powerConfig.last_overload
          });
          
          // Alert if newly overloaded
          if (isOverloaded && !powerConfig.is_overloaded) {
            toast({
              title: 'Power Overload Detected!',
              description: 'The system has detected a power overload condition.',
              variant: 'destructive'
            });
          }
        }
      }
    } catch (error) {
      console.error('Error updating power usage:', error);
    }
  };

  useEffect(() => {
    fetchPowerMonitoring();

    // Immediate power calculation on mount
    updatePowerUsage();

    // Set up a periodic power check that runs every 5 seconds
    const intervalId = setInterval(() => {
      updatePowerUsage();
    }, 5000);

    // Listen to changes in both power_monitoring and devices tables
    const powerChannel = supabase
      .channel('power_monitoring_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'power_monitoring'
        },
        (payload) => {
          console.log('Received power monitoring update:', payload);
          if (payload.new && 
              typeof payload.new === 'object' && 
              'is_overloaded' in payload.new) {
            
            const newData = payload.new as PowerMonitoringData;
            setPowerConfig(newData);
            
            if (newData.is_overloaded && (!powerConfig || !powerConfig.is_overloaded)) {
              toast({
                title: 'Power Overload Detected!',
                description: 'The system has detected a power overload condition.',
                variant: 'destructive'
              });
            }
          } else {
            console.error('Received invalid power monitoring data:', payload);
          }
        }
      )
      .subscribe((status) => {
        console.log('Power monitoring realtime subscription status:', status);
      });

    // Add a more aggressive listener specifically for device changes
    const devicesChannel = supabase
      .channel('devices_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'devices'
        },
        (payload) => {
          console.log('Device updated via SQL or API:', payload);
          // Immediately recalculate power when any device changes
          updatePowerUsage();
        }
      )
      .subscribe((status) => {
        console.log('Devices realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime subscription');
      clearInterval(intervalId);
      supabase.removeChannel(powerChannel);
      supabase.removeChannel(devicesChannel);
    };
  }, []);

  return {
    powerConfig,
    loading,
    error,
    triggerLoading,
    fetchPowerMonitoring,
    toggleAutoManagement,
    triggerPowerManagement
  };
};
