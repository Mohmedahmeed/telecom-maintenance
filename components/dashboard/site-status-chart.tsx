"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#ef4444"]; // green, blue, yellow, red

// Dummy data for now – replace with props later if needed
const data = [
  { name: "Active", value: 12 },
  { name: "Maintenance", value: 3 },
  { name: "Inactive", value: 2 },
  { name: "Fault", value: 1 },
];

export function SiteStatusChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Site Status</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
