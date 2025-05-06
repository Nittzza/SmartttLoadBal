
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { LoadingPlaceholder } from "./analyticsUtils";

type UsageTabProps = {
  usagePatterns: any[];
  hourlyUsage: any[];
  loading: boolean;
};

const UsageTab: React.FC<UsageTabProps> = ({ usagePatterns, hourlyUsage, loading }) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>Daily Usage Pattern</CardTitle>
        <CardDescription>Energy consumption over the past week</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {loading ? (
          <LoadingPlaceholder />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={usagePatterns}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="kWh" 
                stroke="hsl(var(--primary))" 
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Hourly Usage Distribution</CardTitle>
        <CardDescription>When you use the most energy</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {loading ? (
          <LoadingPlaceholder />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={hourlyUsage}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="usage" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  </div>
);

export default UsageTab;
