
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";

type Props = {
  loading: boolean;
  totalPower: number;
};

const TotalPowerCard: React.FC<Props> = ({ loading, totalPower }) => (
  <Card>
    <CardHeader>
      <CardTitle>Total Power Assigned</CardTitle>
      <CardDescription>Sum of device maximum power (Watts)</CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Loader2 className="animate-spin w-6 h-6 mx-auto my-5" />
      ) : (
        <div className="text-center">
          <span className="text-4xl font-bold">{totalPower}</span>
          <span className="text-lg text-gray-500 ml-1">W</span>
          <div className="mt-2 text-sm text-muted-foreground">
            <Zap className="inline-block h-4 w-4 mr-1 text-amber-500" />
            {(totalPower / 1000).toFixed(2)} kW estimated peak load
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

export default TotalPowerCard;
