// components/manage/stats-cards.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Activity, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalAssessments: number;
  totalPatients: number;
  recentAssessments: number;
  diagnosisBreakdown: Record<string, number>;
}

const DIAGNOSIS_LABELS: Record<string, string> = {
  'ASTHMA': 'Asthma',
  'COPD': 'COPD',
  'ACOD': 'ACOD',
  'BRONCHIECTASIS': 'Bronchiectasis',
  'ALLERGIC_RHINITIS': 'AR',
  'GERD': 'GERD',
};

export function StatsCards({ 
  totalAssessments, 
  totalPatients, 
  recentAssessments,
  diagnosisBreakdown 
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            ผู้ป่วยทั้งหมด
          </CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPatients}</div>
          <p className="text-xs text-gray-500">จำนวนผู้ป่วยที่บันทึก</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            การประเมินทั้งหมด
          </CardTitle>
          <FileText className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssessments}</div>
          <p className="text-xs text-gray-500">จำนวนครั้งที่ประเมิน</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            7 วันล่าสุด
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentAssessments}</div>
          <p className="text-xs text-gray-500">การประเมินใหม่</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            โรคหลัก
          </CardTitle>
          <Activity className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(diagnosisBreakdown)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([diagnosis, count]) => (
                <div key={diagnosis} className="flex justify-between text-xs">
                  <span className="text-gray-600">
                    {DIAGNOSIS_LABELS[diagnosis] || diagnosis}
                  </span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}