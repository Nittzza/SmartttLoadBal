
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";

type CategorySummary = {
  name: string;
  value: number;
  color: string;
};

type Props = {
  loading: boolean;
  categoryData: CategorySummary[];
};

const CategoryBreakdownCard: React.FC<Props> = ({ loading, categoryData }) => (
  <Card>
    <CardHeader>
      <CardTitle>Category Breakdown</CardTitle>
      <CardDescription>
        Power distribution by device category
      </CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Loader2 className="animate-spin w-6 h-6 mx-auto my-5" />
      ) : categoryData.length === 0 ? (
        <div className="text-center text-gray-500">No data</div>
      ) : (
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={({ name }) => name}
              >
                {categoryData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </CardContent>
  </Card>
);

export default CategoryBreakdownCard;
