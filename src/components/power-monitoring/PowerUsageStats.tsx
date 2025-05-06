
import React from 'react';
import { Progress } from '@/components/ui/progress';
import type { PowerMonitoringData } from '@/hooks/usePowerMonitoring';

interface PowerUsageStatsProps {
  powerConfig: PowerMonitoringData;
}

const PowerUsageStats: React.FC<PowerUsageStatsProps> = ({ powerConfig }) => {
  const powerUsagePercentage = (powerConfig.current_load / powerConfig.total_power_threshold) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span>Current Load: {powerConfig.current_load} W</span>
        <span>Threshold: {powerConfig.total_power_threshold} W</span>
      </div>
      
      <div className="w-full">
        <Progress 
          value={powerUsagePercentage} 
          className={`h-2 ${
            powerUsagePercentage > 90 ? 'bg-red-200' : 
            powerUsagePercentage > 70 ? 'bg-amber-200' : 
            'bg-green-200'
          }`}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default PowerUsageStats;
