
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, BarChart, Bar, Cell, CartesianGrid, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { COLORS, LoadingPlaceholder } from "./analyticsUtils";

type DevicesTabProps = {
  loading: boolean;
  devicesByConsumption: any[];
  deviceStats: any[];
};

const DevicesTab: React.FC<DevicesTabProps> = ({ loading, devicesByConsumption, deviceStats }) => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Top Energy Consumers</CardTitle>
          <CardDescription>Devices using the most power</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <LoadingPlaceholder />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={devicesByConsumption}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {devicesByConsumption.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Energy by Device Type</CardTitle>
          <CardDescription>Consumption by category</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {loading ? (
            <LoadingPlaceholder />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deviceStats}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Usage Insights</CardTitle>
        <CardDescription>Key observations about your device usage</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-priority-high"></div>
            <span>Your kitchen appliances account for 45% of your total energy consumption.</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-priority-medium"></div>
            <span>Heating devices show the most variable usage pattern based on time of day.</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-priority-low"></div>
            <span>TV and entertainment devices are mostly used during evening hours (6 PM - 10 PM).</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-priority-high"></div>
            <span>Your washing machine uses 20% more energy than average for similar models.</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

export default DevicesTab;
