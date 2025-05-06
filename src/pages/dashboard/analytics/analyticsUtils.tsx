
import { Loader2 } from "lucide-react";

// Color palette for visualizations
export const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a4a4ff", 
  "#8884d8", "#ffc658", "#82ca9d", "#ff7c7c", "#777777"
];

// Loading placeholder component for charts
export const LoadingPlaceholder = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="animate-spin w-6 h-6 mr-2" />
    <span className="text-muted-foreground">Loading data...</span>
  </div>
);
