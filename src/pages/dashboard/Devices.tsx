import { useState, useEffect, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

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

const Devices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeBadgeVisible, setRealtimeBadgeVisible] = useState(false);
  const { toast } = useToast();

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("devices")
        .select("*");

      if (error) throw error;

      if (data) {
        setDevices(data);
        console.log("Fetched devices:", data);
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      toast({
        title: "Error loading devices",
        description: "Could not fetch device data from database",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    console.log("Setting up realtime listener for devices table");
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'devices' },
        (payload) => {
          console.log("Realtime update detected:", payload);
          setRealtimeBadgeVisible(true);
          toast({
            title: "Device data updated in real time",
            description: "Your device list has automatically synced.",
            variant: "default",
            duration: 20000,
            style: { background: "#10b981", color: "white" }
          });
          setTimeout(() => setRealtimeBadgeVisible(false), 2000);
          fetchDevices();
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      console.log("Cleaning up realtime listener");
      supabase.removeChannel(channel);
    };
  }, [fetchDevices, toast]);

  const getPriorityClass = (priority: string | null) => {
    if (!priority) return "bg-gray-100 text-gray-800";
    switch(priority.toLowerCase()) {
      case 'high':
        return "bg-red-100 text-red-800";
      case 'medium':
        return "bg-amber-100 text-amber-800";
      case 'low':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriority = (device: Device): string => {
    if (device.priority) return device.priority;
    if (device.power_max === null || device.power_max === undefined) return "low";
    const value = Number(device.power_max);
    if (value < 50) return "low";
    if (value < 200) return "medium";
    return "high";
  };

  return (
    <div className="space-y-6">
      <div className="py-1">
        <h2 className="text-3xl font-bold tracking-tight">Devices</h2>
        <p className="text-muted-foreground">
          Manage your connected smart devices and their power usage.
        </p>
      </div>
      
      {realtimeBadgeVisible && (
        <div className="flex items-center gap-2 mb-2 transition-all">
          <Badge className="bg-blue-500 text-white animate-pulse px-3">
            <Loader size={16} className="inline-block mr-1 animate-spin" />
            Realtime update!
          </Badge>
          <span className="text-xs text-blue-700">(Data just updated automatically)</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Device List</CardTitle>
          <CardDescription>View and manage all your connected devices</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <p>Loading devices...</p>
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">No devices found</p>
              <p className="text-gray-500">Connect devices to see them here</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Power (W)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.plug_name || "Unnamed Device"}</TableCell>
                      <TableCell>{device.appliance_category || "Uncategorized"}</TableCell>
                      <TableCell>{device.location || "—"}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityClass(getPriority(device))}>
                          {getPriority(device).charAt(0).toUpperCase() + getPriority(device).slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={device.status === "active" ? "default" : "outline"}
                          className={device.status === "active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {(device.status?.charAt(0).toUpperCase() || "-") + (device.status?.slice(1) || "")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {device.power_max ? Number(device.power_max).toFixed(0) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Devices;
