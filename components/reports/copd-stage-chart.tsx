// components/reports/copd-stage-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface COPDStageData {
  stageA: number;
  stageB: number;
  stageC: number;
  stageD: number;
  notApplicable: number;
}

interface COPDStageChartProps {
  data: COPDStageData;
}

const COLORS = {
  stageA: '#10b981',   // green-500
  stageB: '#3b82f6',   // blue-500
  stageC: '#f59e0b',   // amber-500
  stageD: '#ef4444',   // red-500
};

export function COPDStageChart({ data }: COPDStageChartProps) {
  const chartData = [
    { 
      name: 'Stage A', 
      value: data.stageA,
      color: COLORS.stageA,
      description: 'Low risk, fewer symptoms'
    },
    { 
      name: 'Stage B', 
      value: data.stageB,
      color: COLORS.stageB,
      description: 'Low risk, more symptoms'
    },
    { 
      name: 'Stage C', 
      value: data.stageC,
      color: COLORS.stageC,
      description: 'High risk, fewer symptoms'
    },
    { 
      name: 'Stage D', 
      value: data.stageD,
      color: COLORS.stageD,
      description: 'High risk, more symptoms'
    },
  ];

  const total = data.stageA + data.stageB + data.stageC + data.stageD;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>COPD Stage Distribution</CardTitle>
          <CardDescription>การแบ่งระดับความรุนแรง COPD</CardDescription>
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
        <CardTitle>COPD Stage Distribution</CardTitle>
        <CardDescription>
          การแบ่งระดับความรุนแรง COPD (n={total})
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-semibold">{data.name}</p>
                      <p className="text-sm text-gray-600">{data.description}</p>
                      <p className="font-medium mt-1">{data.value} รายการ</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}