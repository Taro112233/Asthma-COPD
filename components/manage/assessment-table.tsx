// components/manage/assessment-table.tsx
"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Download, 
  Trash2, 
  Eye,
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Assessment {
  id: string;
  assessmentDate: string;
  assessmentRound: string | null;
  primaryDiagnosis: string | null;
  compliancePercent: number | null;
  assessedBy: string | null;
  createdAt: string;
  patient: {
    hospitalNumber: string;
    firstName: string | null;
    lastName: string | null;
    age: number | null;
    patientType: string | null;
  };
}

type SortField = 'assessmentDate' | 'hospitalNumber' | 'compliancePercent';
type SortDirection = 'asc' | 'desc' | null;

interface AssessmentTableProps {
  assessments: Assessment[];
  onRefresh: () => Promise<void>;
}

// Diagnosis labels in Thai
const DIAGNOSIS_LABELS: Record<string, string> = {
  'ASTHMA': 'หอบหืด',
  'COPD': 'ปอดอุดกั้นเรื้อรัง',
  'ACOD': 'ACOD',
  'BRONCHIECTASIS': 'หลอดลมขยาย',
  'ALLERGIC_RHINITIS': 'AR',
  'GERD': 'GERD',
};

export function AssessmentTable({ assessments, onRefresh }: AssessmentTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('assessmentDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === sortedAssessments.length && sortedAssessments.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedAssessments.map(a => a.id)));
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAssessments = [...assessments].sort((a, b) => {
    if (!sortDirection) return 0;

    let aVal: any = a;
    let bVal: any = b;

    if (sortField === 'assessmentDate') {
      aVal = new Date(a.assessmentDate).getTime();
      bVal = new Date(b.assessmentDate).getTime();
    } else if (sortField === 'hospitalNumber') {
      aVal = a.patient.hospitalNumber;
      bVal = b.patient.hospitalNumber;
    } else if (sortField === 'compliancePercent') {
      aVal = a.compliancePercent || 0;
      bVal = b.compliancePercent || 0;
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleExportSelected = () => {
    const selectedAssessments = assessments.filter(a => selectedIds.has(a.id));
    
    if (selectedAssessments.length === 0) {
      alert("กรุณาเลือกรายการที่ต้องการ Export");
      return;
    }

    const exportData = selectedAssessments.map((assessment, index) => ({
      "ลำดับ": index + 1,
      "HN": assessment.patient.hospitalNumber,
      "ชื่อ-สกุล": `${assessment.patient.firstName || ''} ${assessment.patient.lastName || ''}`.trim(),
      "อายุ": assessment.patient.age || '-',
      "ประเภท": assessment.patient.patientType === 'ADULT' ? 'ผู้ใหญ่' : 'เด็ก',
      "วันที่ประเมิน": new Date(assessment.assessmentDate).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      "รอบการประเมิน": assessment.assessmentRound === 'PRE_COUNSELING' ? 'Pre' : 'Post',
      "โรคหลัก": DIAGNOSIS_LABELS[assessment.primaryDiagnosis || ''] || '-',
      "Compliance %": assessment.compliancePercent || 0,
      "ประเมินโดย": assessment.assessedBy || '-',
      "วันที่บันทึก": new Date(assessment.createdAt).toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assessments");

    const fileName = `assessments_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/admin/assessments/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });

      if (response.ok) {
        setSelectedIds(new Set());
        setDeleteDialogOpen(false);
        await onRefresh();
      } else {
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } catch (error) {
      console.error('Error deleting assessments:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setIsDeleting(false);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field || !sortDirection) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={handleExportSelected}
          disabled={selectedIds.size === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export ({selectedIds.size})
        </Button>
        <Button
          onClick={() => setDeleteDialogOpen(true)}
          disabled={selectedIds.size === 0}
          variant="destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          ลบ ({selectedIds.size})
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.size === sortedAssessments.length && sortedAssessments.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('hospitalNumber')}
                >
                  <div className="flex items-center">
                    HN / ชื่อ-สกุล
                    {getSortIcon('hospitalNumber')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('assessmentDate')}
                >
                  <div className="flex items-center">
                    วันที่ประเมิน
                    {getSortIcon('assessmentDate')}
                  </div>
                </TableHead>
                <TableHead>รอบ</TableHead>
                <TableHead>โรคหลัก</TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('compliancePercent')}
                >
                  <div className="flex items-center">
                    Compliance
                    {getSortIcon('compliancePercent')}
                  </div>
                </TableHead>
                <TableHead>ประเมินโดย</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAssessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              ) : (
                sortedAssessments.map((assessment) => (
                  <TableRow 
                    key={assessment.id}
                    className={`${
                      selectedIds.has(assessment.id) 
                        ? 'bg-blue-50' 
                        : ''
                    }`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(assessment.id)}
                        onCheckedChange={() => toggleSelection(assessment.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{assessment.patient.hospitalNumber}</div>
                      <div className="text-sm text-gray-500">
                        {assessment.patient.firstName} {assessment.patient.lastName}
                        {assessment.patient.age && ` (${assessment.patient.age} ปี)`}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(assessment.assessmentDate).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={assessment.assessmentRound === 'PRE_COUNSELING' ? 'secondary' : 'default'}>
                        {assessment.assessmentRound === 'PRE_COUNSELING' ? 'Pre' : 'Post'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {assessment.primaryDiagnosis ? (
                        <Badge variant="outline">
                          {DIAGNOSIS_LABELS[assessment.primaryDiagnosis] || assessment.primaryDiagnosis}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {assessment.compliancePercent !== null ? `${assessment.compliancePercent}%` : '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {assessment.assessedBy || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/manage/${assessment.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบข้อมูล {selectedIds.size} รายการที่เลือก? 
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "กำลังลบ..." : "ลบข้อมูล"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}