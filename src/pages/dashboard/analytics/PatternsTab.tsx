
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const PatternsTab = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>Usage Pattern Analysis</CardTitle>
        <CardDescription>Insights based on your usage patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Peak Usage Times</h3>
            <p className="text-sm text-muted-foreground">
              Your household typically consumes the most energy between 6 PM and 9 PM.
              Consider shifting some activities to off-peak hours to reduce costs.
            </p>
          </div>
  
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Standby Power</h3>
            <p className="text-sm text-muted-foreground">
              Approximately 12% of your energy is consumed by devices in standby mode.
              Unplugging or using smart plugs could save up to $15 monthly.
            </p>
          </div>
  
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Heating & Cooling</h3>
            <p className="text-sm text-muted-foreground">
              Temperature control devices show usage patterns that could be optimized.
              Consider a programmable thermostat schedule.
            </p>
          </div>
  
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Seasonal Trends</h3>
            <p className="text-sm text-muted-foreground">
              Your energy usage increases by approximately 30% during winter months.
              Additional insulation could help reduce this seasonal spike.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Optimization Recommendations</CardTitle>
        <CardDescription>Automated suggestions based on your usage</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-priority-low/20 text-priority-low">1</div>
            <div>
              <p className="font-medium">Schedule Laundry for Off-Peak Hours</p>
              <p className="text-sm text-muted-foreground">
                Running your washing machine and dryer after 10 PM could save up to 15% on their operating costs.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-priority-medium/20 text-priority-medium">2</div>
            <div>
              <p className="font-medium">Replace Kitchen Refrigerator</p>
              <p className="text-sm text-muted-foreground">
                Your refrigerator is using 25% more energy than modern energy-efficient models.
                Upgrading could pay for itself within 2-3 years.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-priority-high/20 text-priority-high">3</div>
            <div>
              <p className="font-medium">Check Home Office Equipment</p>
              <p className="text-sm text-muted-foreground">
                Unusual power spikes detected from your home office plugs.
                Consider using a power strip with an on/off switch to reduce phantom power.
              </p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

export default PatternsTab;
