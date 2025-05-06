
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import DevicesTab from "./analytics/DevicesTab";
import UsageTab from "./analytics/UsageTab";
import PatternsTab from "./analytics/PatternsTab";
import AnalyticsHeader from "./analytics/AnalyticsHeader";
import TotalPowerCard from "./analytics/TotalPowerCard";
import PeakDeviceCard from "./analytics/PeakDeviceCard";
import CategoryBreakdownCard from "./analytics/CategoryBreakdownCard";
import DeviceListTable from "./analytics/DeviceListTable";

const PIE_COLORS = [
  "#9b87f5", "#0FA0CE", "#F97316", "#8B5CF6", "#F2FCE2", "#ea384c", "#D3E4FD"
];

type DeviceRow = {
  id: number;
  plug_name: string | null;
  appliance_category: string | null;
  power_max: number | null;
  status: string | null;
};

type CategorySummary = {
  name: string;
  value: number;
  color: string;
};

const Analytics = () => {
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [categoryData, setCategoryData] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPower, setTotalPower] = useState(0);
  const [devicesByConsumption, setDevicesByConsumption] = useState<any[]>([]);
  const [deviceStats, setDeviceStats] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [usagePatterns, setUsagePatterns] = useState<any[]>([]);
  const [hourlyUsage, setHourlyUsage] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("devices")
          .select("id, plug_name, appliance_category, power_max, status");
        
        if (error) {
          console.error("Error fetching devices:", error);
          setError("Failed to load device data");
          setLoading(false);
          return;
        }
        
        const devicesData = data || [];
        setDevices(devicesData);

        const categoryMap: { [key: string]: number } = {};
        let total = 0;
        devicesData.forEach(d => {
          const cat = d.appliance_category || "Unknown";
          const pwr = Number(d.power_max) || 0;
          categoryMap[cat] = (categoryMap[cat] || 0) + pwr;
          total += pwr;
        });
        setTotalPower(total);
        
        setCategoryData(Object.entries(categoryMap).map(([name, value], idx) => ({
          name,
          value,
          color: PIE_COLORS[idx % PIE_COLORS.length]
        })));

        if (devicesData.length > 0) {
          const deviceConsumption = devicesData
            .filter(d => d.power_max)
            .sort((a, b) => (b.power_max || 0) - (a.power_max || 0))
            .slice(0, 5)
            .map(d => ({
              name: d.plug_name || `Device ${d.id}`,
              value: d.power_max || 0
            }));
            
          setDevicesByConsumption(deviceConsumption);
          
          const statsByCategory = Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
            
          setDeviceStats(statsByCategory);
          
          generateSimulatedUsageData(devicesData);
        }
        
      } catch (err) {
        console.error("Error in analytics:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    fetchAnalytics();
  }, []);

  const generateSimulatedUsageData = (deviceData: DeviceRow[]) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const totalDevicePower = deviceData.reduce((sum, device) => sum + (device.power_max || 0), 0);
    
    const weekdayPattern = daysOfWeek.map((day, index) => {
      const isWeekend = index >= 5;
      const baseUsage = totalDevicePower * 0.6;
      const variableMultiplier = isWeekend ? 
        0.5 + Math.random() * 0.3 : 
        0.8 + Math.random() * 0.4;
      
      return {
        name: day,
        kWh: parseFloat((baseUsage * variableMultiplier / 1000 * 4).toFixed(2))
      };
    });
    
    setUsagePatterns(weekdayPattern);
    
    const hours = Array.from({length: 24}, (_, i) => i);
    const hourlyPattern = hours.map(hour => {
      let usageMultiplier = 0.2;
      
      if (hour >= 6 && hour <= 9) {
        usageMultiplier = 0.7 + Math.random() * 0.3;
      } else if (hour >= 17 && hour <= 22) {
        usageMultiplier = 0.8 + Math.random() * 0.4;
      } else if ((hour > 9 && hour < 17) || (hour > 22 && hour < 24)) {
        usageMultiplier = 0.3 + Math.random() * 0.2;
      } else {
        usageMultiplier = 0.1 + Math.random() * 0.1;
      }
      
      return {
        hour: `${hour}:00`,
        usage: parseFloat((totalDevicePower * usageMultiplier / 1000).toFixed(2))
      };
    });
    
    setHourlyUsage(hourlyPattern);
  };

  const maxDevice = devices.reduce((max, d) => {
    if ((d.power_max || 0) > (max.power_max || 0)) return d;
    return max;
  }, { power_max: 0 } as DeviceRow);

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Monitor your energy usage and optimize your smart loads.
          </p>
        </div>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <h3 className="text-lg font-medium">Error Loading Analytics</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnalyticsHeader />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <TotalPowerCard loading={loading} totalPower={totalPower} />
        <PeakDeviceCard loading={loading} maxDevice={maxDevice} />
        <CategoryBreakdownCard loading={loading} categoryData={categoryData} />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Device Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage Analysis</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Recognition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <DevicesTab 
            loading={loading} 
            devicesByConsumption={devicesByConsumption}
            deviceStats={deviceStats}
          />
        </TabsContent>
        
        <TabsContent value="usage" className="mt-4">
          <UsageTab 
            loading={loading}
            usagePatterns={usagePatterns}
            hourlyUsage={hourlyUsage}
          />
        </TabsContent>
        
        <TabsContent value="patterns" className="mt-4">
          <PatternsTab />
        </TabsContent>
      </Tabs>

      <DeviceListTable loading={loading} devices={devices} />
    </div>
  );
};

export default Analytics;
