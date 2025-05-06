
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ChevronDown, ChevronUp, Power } from 'lucide-react';
import { usePowerMonitoring } from '@/hooks/usePowerMonitoring';
import PowerUsageStats from './power-monitoring/PowerUsageStats';
import OverloadWarning from './power-monitoring/OverloadWarning';
import AutoManagementControls from './power-monitoring/AutoManagementControls';
import { toast } from '@/hooks/use-toast';
import OverloadDetailsToast from './power-monitoring/OverloadDetailsToast';
import { supabase } from '@/integrations/supabase/client';

const PowerMonitoring: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const {
    powerConfig,
    loading,
    error,
    triggerLoading,
    fetchPowerMonitoring,
    toggleAutoManagement,
    triggerPowerManagement
  } = usePowerMonitoring();

  const handleTriggerPowerManagement = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('power-management', {});
      
      if (error) throw error;
      
      // Show device management details in toast when devices are turned off
      if (data?.status === 'overload_managed' && data.devicesDisabled?.length > 0) {
        toast({
          title: 'Power Overload Management',
          description: (
            <OverloadDetailsToast 
              message={`Power reduced from ${data.originalPower}W to ${data.currentPower}W`}
              devicesDisabled={data.devicesDisabled}
            />
          ),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error in power management UI handler:', error);
      toast({
        title: 'Error',
        description: 'Failed to manage power overload',
        variant: 'destructive'
      });
    }
    
    triggerPowerManagement();
  };

  if (error) return (
    <Card className="mb-4 border-red-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="text-red-500" />
          Power Monitoring Error
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{error}</p>
        <Button 
          onClick={fetchPowerMonitoring} 
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          Retry
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) return (
    <Card className="mb-4 animate-pulse">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Power className="text-gray-400" />
          Loading Power Data...
        </CardTitle>
      </CardHeader>
    </Card>
  );
  
  if (!powerConfig) return null;

  return (
    <Card className={`mb-4 ${powerConfig.is_overloaded ? 'border-red-500' : ''}`}>
      <CardHeader 
        className="cursor-pointer flex flex-row items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <CardTitle className="flex items-center gap-2">
          {powerConfig.is_overloaded && (
            <AlertTriangle className="text-red-500" />
          )}
          <Power className={powerConfig.is_overloaded ? "text-red-500" : "text-blue-500"} />
          Power Monitoring
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="space-y-4">
            <PowerUsageStats powerConfig={powerConfig} />
            
            {powerConfig.is_overloaded && (
              <OverloadWarning autoManagementEnabled={powerConfig.auto_management_enabled} />
            )}
            
            <AutoManagementControls 
              isEnabled={powerConfig.auto_management_enabled}
              onToggle={toggleAutoManagement}
              onTriggerManagement={handleTriggerPowerManagement}
              isLoading={triggerLoading}
            />
            
            <div className="text-xs text-gray-500 mt-2">
              {powerConfig.last_overload ? (
                <p>Last overload: {new Date(powerConfig.last_overload).toLocaleString()}</p>
              ) : (
                <p>No recent overloads detected</p>
              )}
            </div>

            <div className="mt-4 text-xs text-blue-600">
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchPowerMonitoring();
                }}
              >
                Refresh Power Data
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default PowerMonitoring;
