import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PowerMonitoring from "@/components/PowerMonitoring";
import PowerMonitoringTester from "@/components/PowerMonitoringTester";

interface Device {
  id: number;
  plug_name: string | null;
  appliance_category: string | null;
  power_max: number | null;
  comment: string | null;
  status: string | null;
  priority: string | null;
  location: string | null;
  last_active: string | null;
  first_ts: string | null;
  last_ts: string | null;
  available_duration: number | null;
  files_names: string | null;
}

interface DeviceSummary {
  totalDevices: number;
  activeDevices: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
}

const Dashboard = () => {
  const [dailyConsumption, setDailyConsumption] = useState<any[]>([]);
  const [devicesByPriority, setDevicesByPriority] = useState<any[]>([]);
  const [deviceSummary, setDeviceSummary] = useState<DeviceSummary>({
    totalDevices: 0,
    activeDevices: 0,
    highPriorityCount: 0,
    mediumPriorityCount: 0,
    lowPriorityCount: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const { data: devices, error } = await supabase
          .from("devices")
          .select("*");

        if (error) throw error;
        if (devices) {
          const now = new Date();
          const dailyData = [];
          const totalDevicePower = devices.reduce(
            (sum, device) => sum + (Number(device.power_max) || 0),
            0
          );
          for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const factor = 0.7 + Math.random() * 0.6;
            const kWh = (totalDevicePower / 1000) * 24 * factor;
            const cost = kWh * 0.15;
            dailyData.push({
              date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              kWh: kWh.toFixed(2),
              cost: cost.toFixed(2)
            });
          }
          setDailyConsumption(dailyData);

          const getPriority = (device: Device): string => {
            if (device.priority) return device.priority;
            if (device.power_max === null || device.power_max === undefined) return "low";
            const value = Number(device.power_max);
            if (value < 50) return "low";
            if (value < 200) return "medium";
            return "high";
          };

          const summary = {
            totalDevices: devices.length,
            activeDevices: devices.filter(d => d.status === "active").length,
            highPriorityCount: devices.filter(d => getPriority(d) === "high").length,
            mediumPriorityCount: devices.filter(d => getPriority(d) === "medium").length,
            lowPriorityCount: devices.filter(d => getPriority(d) === "low").length,
          };
          setDeviceSummary(summary);

          const priorityData = [
            { name: "High", value: summary.highPriorityCount, fill: "#ef4444" },
            { name: "Medium", value: summary.mediumPriorityCount, fill: "#f59e0b" },
            { name: "Low", value: summary.lowPriorityCount, fill: "#10b981" },
          ];
          setDevicesByPriority(priorityData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error loading dashboard",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [toast]);

  return (
    <div className="space-y-8">
      <PowerMonitoring />
      <PowerMonitoringTester />

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your smart home energy consumption.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{deviceSummary.totalDevices}</div>
                <p className="text-xs text-muted-foreground">
                  {deviceSummary.activeDevices} active devices
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <div className="h-4 w-4 rounded-full bg-priority-high"></div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{deviceSummary.highPriorityCount}</div>
                <p className="text-xs text-muted-foreground">
                  Devices requiring attention
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
            <div className="h-4 w-4 rounded-full bg-priority-medium"></div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{deviceSummary.mediumPriorityCount}</div>
                <p className="text-xs text-muted-foreground">
                  Occasional use devices
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Priority</CardTitle>
            <div className="h-4 w-4 rounded-full bg-priority-low"></div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{deviceSummary.lowPriorityCount}</div>
                <p className="text-xs text-muted-foreground">
                  Energy-efficient devices
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Energy Consumption</CardTitle>
            <CardDescription>Daily energy usage over the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-40 w-full animate-pulse rounded bg-muted"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyConsumption}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="kWh" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Devices by Priority</CardTitle>
            <CardDescription>Distribution of device priority levels</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-40 w-full animate-pulse rounded bg-muted"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={devicesByPriority}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Devices" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Tips</CardTitle>
          <CardDescription>Recommendations based on your device usage</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-priority-high"></div>
              <span>Consider running your washing machine after 10 PM for better energy rates.</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-priority-medium"></div>
              <span>Your refrigerator consumes more energy than average. Consider checking its settings.</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-priority-low"></div>
              <span>Great job optimizing your TV usage! It's now in the low priority category.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
