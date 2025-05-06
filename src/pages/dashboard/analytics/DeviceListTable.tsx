
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type DeviceRow = {
  id: number;
  plug_name: string | null;
  appliance_category: string | null;
  power_max: number | null;
  status: string | null;
};

type Props = {
  loading: boolean;
  devices: DeviceRow[];
};

const DeviceListTable: React.FC<Props> = ({ loading, devices }) => (
  <Card>
    <CardHeader>
      <CardTitle>Device List</CardTitle>
      <CardDescription>Summary of all smart devices</CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Loader2 className="animate-spin w-6 h-6 mx-auto my-5" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Max Power (W)</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(dev => (
                <tr key={dev.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-2">{dev.plug_name || "—"}</td>
                  <td className="px-4 py-2">{dev.appliance_category || "Unknown"}</td>
                  <td className="px-4 py-2">
                    <Badge variant={dev.status === "active" ? "default" : "outline"}>
                      {dev.status?.charAt(0).toUpperCase() + dev.status?.slice(1) || "—"}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-right">{dev.power_max || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CardContent>
  </Card>
);

export default DeviceListTable;
