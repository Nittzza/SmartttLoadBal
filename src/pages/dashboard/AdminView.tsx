
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define device type based on the database schema
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

const AdminView = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceStats, setDeviceStats] = useState({
    totalDevices: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  });
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchDevices() {
      try {
        const { data, error } = await supabase.from("devices").select("*");
        if (error) throw error;
        
        if (data) {
          setDevices(data);

          // Priority logic as in dashboard
          const getPriority = (device: Device): string => {
            if (device.priority) return device.priority;
            if (device.power_max === null || device.power_max === undefined) return "low";
            const value = Number(device.power_max);
            if (value < 50) return "low";
            if (value < 200) return "medium";
            return "high";
          };

          setDeviceStats({
            totalDevices: data.length,
            highPriority: data.filter(d => getPriority(d) === "high").length,
            mediumPriority: data.filter(d => getPriority(d) === "medium").length,
            lowPriority: data.filter(d => getPriority(d) === "low").length
          });
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        toast({
          title: "Error loading devices",
          description: "Could not fetch device data from database",
          variant: "destructive"
        });
      }
    }
    fetchDevices();
  }, [toast]);

  // Filter based on plug name and category
  const filteredDevices = devices.filter(d => {
    const keyword = searchQuery.toLowerCase();
    return (
      (d.plug_name?.toLowerCase().includes(keyword) ||
        d.appliance_category?.toLowerCase().includes(keyword) ||
        d.comment?.toLowerCase().includes(keyword) ||
        "")
    );
  });

  // Distributions for charts
  const priorityDistribution = [
    { name: "High", value: deviceStats.highPriority },
    { name: "Medium", value: deviceStats.mediumPriority },
    { name: "Low", value: deviceStats.lowPriority }
  ];
  const categoryCounts = (() => {
    const map: { [cat: string]: number } = {};
    devices.forEach(d => {
      const cat = d.appliance_category || "Unknown";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();
  const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#6366f1", "#a3e635", "#fbbf24", "#f87171"];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Device inventory overview from Supabase database.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              className="h-4 w-4 text-muted-foreground">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceStats.totalDevices}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <div className="h-4 w-4 rounded-full bg-priority-high"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceStats.highPriority}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
            <div className="h-4 w-4 rounded-full bg-priority-medium"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceStats.mediumPriority}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Priority</CardTitle>
            <div className="h-4 w-4 rounded-full bg-priority-low"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceStats.lowPriority}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Devices by Priority</CardTitle>
            <CardDescription>Priority breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Devices by Category</CardTitle>
            <CardDescription>Number of devices in each category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryCounts}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" name="Devices" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Table */}
      <Card>
        <CardHeader>
          <CardTitle>Device List</CardTitle>
          <CardDescription>All devices from Supabase table</CardDescription>
          <div className="mt-4">
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plug Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Power Max (W)</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device, idx) => (
                  <TableRow key={device.id || idx}>
                    <TableCell className="font-medium">{device.plug_name || "—"}</TableCell>
                    <TableCell>{device.appliance_category || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          (device.status === "active"
                            ? "bg-priority-low/10 text-priority-low"
                            : "bg-muted text-muted-foreground"
                          )
                        }
                      >
                        {(device.status?.charAt(0).toUpperCase() || "-") + (device.status?.slice(1) || "")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{device.power_max ? Number(device.power_max).toFixed(0) : "—"}</TableCell>
                    <TableCell>{device.comment || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminView;
