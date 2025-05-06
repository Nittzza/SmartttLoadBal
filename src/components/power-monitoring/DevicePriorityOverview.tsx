
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PowerOffIcon, CircleX } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

interface Device {
  id: number;
  plug_name: string;
  power_max: number;
  priority: string;
  status: string;
  last_active: string | null;
}

const DevicePriorityOverview = () => {
  // Query for active devices and power monitoring status
  const { data: powerMonitoring } = useQuery({
    queryKey: ['power-monitoring'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('power_monitoring')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  const { data: devices } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('id, plug_name, power_max, priority, status, last_active')
        .order('power_max', { ascending: false });
      
      if (error) throw error;
      return data as Device[];
    },
    refetchInterval: 5000
  });

  const totalPower = devices?.reduce((sum, device) => 
    device.status === 'active' ? sum + (Number(device.power_max) || 0) : sum, 0) || 0;

  const isOverloaded = totalPower > (powerMonitoring?.total_power_threshold || 2000);

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getDeviceStatusDisplay = (device: Device) => {
    const wasRecentlyTurnedOff = device.status === 'inactive' && 
      device.last_active && 
      new Date(device.last_active).getTime() > Date.now() - 60000; // Within last minute

    if (wasRecentlyTurnedOff) {
      return (
        <div className="flex items-center gap-1 text-red-500">
          <CircleX size={16} />
          <span className="text-xs">Turned off (overload protection)</span>
        </div>
      );
    }

    return (
      <Badge
        variant={device.status === 'active' ? 'default' : 'secondary'}
        className={device.status === 'active' ? 'bg-green-100 text-green-800' : ''}
      >
        {device.status === 'active' ? 'Running' : 'Inactive'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PowerOffIcon className={isOverloaded ? "text-red-500" : "text-blue-500"} />
          Active Devices & Power Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!devices?.length ? (
            <p className="text-muted-foreground">No devices found.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">Total Power:</span>{' '}
                  <span className={isOverloaded ? 'text-red-500 font-bold' : ''}>
                    {totalPower}W
                  </span>
                  {' '}/ {powerMonitoring?.total_power_threshold || 2000}W
                </div>
                <Badge 
                  variant={isOverloaded ? 'destructive' : 'default'}
                  className={!isOverloaded ? 'bg-green-100 text-green-800' : ''}
                >
                  {isOverloaded ? 'Overloaded' : 'Normal'}
                </Badge>
              </div>

              {powerMonitoring?.auto_management_enabled && isOverloaded && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-yellow-700">
                  Auto-management is active and managing power overload
                </div>
              )}

              <div className="divide-y">
                {devices.map((device) => (
                  <div key={device.id} className="py-2">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {device.plug_name || `Device ${device.id}`}
                          </span>
                          <span className={`text-sm ${getPriorityColor(device.priority)}`}>
                            ({device.priority || 'low'} priority)
                          </span>
                        </div>
                        {getDeviceStatusDisplay(device)}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono">{device.power_max}W</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DevicePriorityOverview;
