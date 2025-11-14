// components/reports/asthma-control-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface AsthmaControlData {
  wellControlled: number;
  partlyControlled: number;
  uncontrolled: number;
  notApplicable: number;
}

interface AsthmaControlChartProps {
  data: AsthmaControlData;
}

const COLORS = {
  wellControlled: '#10b981',    // green-500
  partlyControlled: '#f59e0b',  // amber-500
  uncontrolled: '#ef4444',      // red-500
  notApplicable: '#9ca3af',     // gray-400
};

export function AsthmaControlChart({ data }: AsthmaControlChartProps) {
  const chartData = [
    { 
      name: 'Well Controlled (0 ข้อ)', 
      value: data.wellControlled,
      color: COLORS.wellControlled
    },
    { 
      name: 'Partly Controlled (1-2 ข้อ)', 
      value: data.partlyControlled,
      color: COLORS.partlyControlled
    },
    { 
      name: 'Uncontrolled (3-4 ข้อ)', 
      value: data.uncontrolled,
      color: COLORS.uncontrolled
    },
  ].filter(item => item.value > 0); // Show only items with data

  const total = data.wellControlled + data.partlyControlled + data.uncontrolled;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asthma Control Level</CardTitle>
          <CardDescription>ระดับการควบคุมอาการหอบหืด</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-gray-500">ไม่มีข้อมูล</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asthma Control Level</CardTitle>
        <CardDescription>
          ระดับการควบคุมอาการหอบหืด (n={total})
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} รายการ`, '']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}