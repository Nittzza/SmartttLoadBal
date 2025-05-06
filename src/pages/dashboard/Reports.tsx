
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Download, FileText, FileSpreadsheet, Printer } from "lucide-react";

type DeviceRow = {
  id: number;
  plug_name: string | null;
  appliance_category: string | null;
  power_max: number | null;
  status: string | null;
  last_active: string | null;
};

type UsageReport = {
  id: number;
  device_name: string;
  category: string;
  power_consumed: number;
  date: string;
};

const Reports = () => {
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [usageReports, setUsageReports] = useState<UsageReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("weekly");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDevicesData() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("devices")
          .select("id, plug_name, appliance_category, power_max, status, last_active");
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setDevices(data);
          // Generate simulated usage reports based on devices
          generateSimulatedReports(data, reportType);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        toast({
          title: "Error loading data",
          description: "Failed to load device data for reports",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchDevicesData();
  }, [toast, reportType]);

  const generateSimulatedReports = (deviceData: DeviceRow[], type: string) => {
    // Simulated usage report data for demo
    const reports: UsageReport[] = [];
    const currentDate = new Date();

    // Number of days to generate data for based on report type
    const daysToGenerate = type === "daily" ? 1 : type === "weekly" ? 7 : 30;
    
    deviceData.forEach(device => {
      // For each device, generate usage data for each day
      for (let i = 0; i < daysToGenerate; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        
        // Base power consumption on device.power_max with some randomness
        const powerBase = device.power_max || 100;
        const powerConsumed = parseFloat((powerBase * (0.5 + Math.random() * 0.5) / 1000 * 24).toFixed(2));
        
        reports.push({
          id: reports.length + 1,
          device_name: device.plug_name || `Device ${device.id}`,
          category: device.appliance_category || "Uncategorized",
          power_consumed: powerConsumed, // kWh
          date: date.toISOString().split('T')[0]
        });
      }
    });
    
    // Sort by date (newest first)
    reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setUsageReports(reports);
  };

  // Function to export data as CSV
  const exportCSV = () => {
    try {
      // Get report title based on type
      const title = reportType === "daily" ? "Daily" : 
                    reportType === "weekly" ? "Weekly" : "Monthly";
      
      // Create CSV content
      let csvContent = "Date,Device,Category,Power Consumed (kWh)\n";
      
      usageReports.forEach(report => {
        csvContent += `${report.date},${report.device_name},${report.category},${report.power_consumed}\n`;
      });
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${title}_Usage_Report.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `${title} report has been downloaded as CSV`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Failed to export data as CSV",
        variant: "destructive"
      });
    }
  };
  
  // Function to print the report
  const printReport = () => {
    window.print();
    toast({
      title: "Print initiated",
      description: "The report has been sent to your printer",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          View and export usage reports for your smart devices.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Select
            value={reportType}
            onValueChange={(value) => setReportType(value as "daily" | "weekly" | "monthly")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily Report</SelectItem>
              <SelectItem value="weekly">Weekly Report</SelectItem>
              <SelectItem value="monthly">Monthly Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={printReport}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="usage">Usage Reports</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Usage Report</CardTitle>
              <CardDescription>
                {reportType === "daily" ? "Last 24 hours" : 
                 reportType === "weekly" ? "Last 7 days" : "Last 30 days"} of energy consumption data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <p>Loading report data...</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Power (kWh)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usageReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.date}</TableCell>
                          <TableCell className="font-medium">{report.device_name}</TableCell>
                          <TableCell>{report.category}</TableCell>
                          <TableCell className="text-right">{report.power_consumed}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="efficiency" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Efficiency Analysis</CardTitle>
              <CardDescription>
                Review energy efficiency metrics and opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Efficiency Score */}
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Energy Efficiency Score</h3>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-4 bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <span className="font-bold text-lg">72/100</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Your efficiency score is above average. There's still room for improvement.</p>
                </div>
                
                {/* Optimization Tips */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Optimization Recommendations</h3>
                  <ul className="space-y-2">
                    <li className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="font-medium">Shift Washing Machine Usage</p>
                      <p className="text-sm text-muted-foreground">Run your washing machine after 10 PM to take advantage of lower energy rates.</p>
                    </li>
                    <li className="border-l-4 border-amber-500 pl-4 py-2">
                      <p className="font-medium">Refrigerator Temperature Adjustment</p>
                      <p className="text-sm text-muted-foreground">Your refrigerator is consuming more power than similar models. Consider adjusting the temperature by 1-2 degrees.</p>
                    </li>
                    <li className="border-l-4 border-green-500 pl-4 py-2">
                      <p className="font-medium">Smart TV Standby Power</p>
                      <p className="text-sm text-muted-foreground">Your TV is using 12W in standby mode. Enable energy-saving mode or unplug when not in use.</p>
                    </li>
                  </ul>
                </div>
                
                {/* Potential Savings */}
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Potential Monthly Savings</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">$24.75</span>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Detailed Analysis
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
