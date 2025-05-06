
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, Badge, Clock } from "lucide-react";

type Props = {
  loading: boolean;
  maxDevice: {
    plug_name: string | null;
    appliance_category: string | null;
    power_max: number | null;
    status: string | null;
  };
};

const PeakDeviceCard: React.FC<Props> = ({ loading, maxDevice }) => (
  <Card>
    <CardHeader>
      <CardTitle>Peak Power Device</CardTitle>
      <CardDescription>Most power-hungry device</CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Loader2 className="animate-spin w-6 h-6 mx-auto my-5" />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 mt-5">
          <span className="text-xl font-bold">{maxDevice?.plug_name || "—"}</span>
          <div className="inline-block px-2 py-0.5 rounded bg-muted">{maxDevice?.appliance_category || "Unknown"}</div>
          <span className="text-gray-500">
            {maxDevice?.power_max ? `${maxDevice.power_max} W` : "—"}
          </span>
          <div className="text-sm text-muted-foreground mt-2">
            <Clock className="inline-block h-4 w-4 mr-1 text-blue-500" />
            Typically active during evening hours
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

export default PeakDeviceCard;
