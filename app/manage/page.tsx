// app/manage/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AssessmentTable } from "@/components/manage/assessment-table";
import { FilterPanel } from "@/components/manage/filter-panel";
import { StatsCards } from "@/components/manage/stats-cards";
import { toast } from "sonner";

interface Stats {
  totalAssessments: number;
  totalPatients: number;
  recentAssessments: number;
  diagnosisBreakdown: Record<string, number>;
}

export default function ManagePage() {
  const router = useRouter();
  const { username, handleLogout } = useAuth();
  
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState<Stats>({
    totalAssessments: 0,
    totalPatients: 0,
    recentAssessments: 0,
    diagnosisBreakdown: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [search, setSearch] = useState("");
  const [diagnosis, setDiagnosis] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [patientType, setPatientType] = useState("all");

  // ✅ แก้ไขตรงนี้
  const hasActiveFilters = Boolean(
    search || 
    diagnosis !== "all" || 
    dateFrom || 
    dateTo || 
    patientType !== "all"
  );

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (diagnosis !== 'all') params.append('diagnosis', diagnosis);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      if (patientType !== 'all') params.append('patientType', patientType);

      // Fetch assessments and stats in parallel
      const [assessmentsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/assessments?${params.toString()}`),
        fetch('/api/admin/stats')
      ]);

      if (assessmentsRes.ok) {
        const data = await assessmentsRes.json();
        setAssessments(data);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, diagnosis, dateFrom, dateTo, patientType]);

  const handleClearFilters = () => {
    setSearch("");
    setDiagnosis("all");
    setDateFrom("");
    setDateTo("");
    setPatientType("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader username={username} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              จัดการข้อมูล
            </h1>
            <p className="text-gray-500 mt-1">
              ดู ค้นหา และจัดการข้อมูลการประเมินทั้งหมด
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              รีเฟรช
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              <Home className="h-4 w-4 mr-2" />
              กลับหน้าหลัก
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards
          totalAssessments={stats.totalAssessments}
          totalPatients={stats.totalPatients}
          recentAssessments={stats.recentAssessments}
          diagnosisBreakdown={stats.diagnosisBreakdown}
        />

        {/* Filter Panel */}
        <FilterPanel
          search={search}
          diagnosis={diagnosis}
          dateFrom={dateFrom}
          dateTo={dateTo}
          patientType={patientType}
          onSearchChange={setSearch}
          onDiagnosisChange={setDiagnosis}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onPatientTypeChange={setPatientType}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results Summary */}
        <div className="mb-3 text-sm text-gray-600">
          แสดง <span className="font-semibold text-gray-900">{assessments.length}</span> รายการ
          {hasActiveFilters && " (กรองแล้ว)"}
        </div>

        {/* Assessment Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <AssessmentTable 
            assessments={assessments} 
            onRefresh={fetchData}
          />
        )}
      </div>
    </div>
  );
}