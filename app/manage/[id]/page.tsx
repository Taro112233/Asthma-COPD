// app/manage/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
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

const DIAGNOSIS_LABELS: Record<string, string> = {
  'ASTHMA': 'หอบหืด',
  'COPD': 'ปอดอุดกั้นเรื้อรัง',
  'ACOD': 'ACOD',
  'BRONCHIECTASIS': 'หลอดลมขยาย',
  'ALLERGIC_RHINITIS': 'AR',
  'GERD': 'GERD',
};

export default function AssessmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [assessment, setAssessment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAssessment();
  }, [params.id]);

  const fetchAssessment = async () => {
    try {
      const res = await fetch(`/api/assessments/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setAssessment(data);
      } else {
        toast.error('ไม่พบข้อมูลการประเมิน');
        router.push('/manage');
      }
    } catch (error) {
      console.error('Error fetching assessment:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/assessments/${params.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('ลบข้อมูลสำเร็จ');
        router.push('/manage');
      } else {
        toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/manage')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                รายละเอียดการประเมิน
              </h1>
              <p className="text-gray-500">HN: {assessment.patient.hospitalNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/form?edit=${assessment.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              แก้ไข
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              ลบ
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>ข้อมูลผู้ป่วย</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">HN</label>
                <p className="text-base font-medium">{assessment.patient.hospitalNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ชื่อ-สกุล</label>
                <p className="text-base font-medium">
                  {assessment.patient.firstName} {assessment.patient.lastName}
                </p>
              </div>
              {assessment.patient.age && (
                <div>
                  <label className="text-sm font-medium text-gray-500">อายุ</label>
                  <p className="text-base">{assessment.patient.age} ปี</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assessment Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>ข้อมูลการประเมิน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">วันที่ประเมิน</label>
                  <p className="text-base">
                    {new Date(assessment.assessmentDate).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">โรคหลัก</label>
                  <p className="text-base">
                    {assessment.primaryDiagnosis ? (
                      <Badge variant="outline">
                        {DIAGNOSIS_LABELS[assessment.primaryDiagnosis] || assessment.primaryDiagnosis}
                      </Badge>
                    ) : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Compliance</label>
                  <p className="text-base font-medium">
                    {assessment.compliancePercent !== null ? `${assessment.compliancePercent}%` : '-'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">ประเมินโดย</label>
                <p className="text-base">{assessment.assessedBy || '-'}</p>
              </div>

              {assessment.note && (
                <div>
                  <label className="text-sm font-medium text-gray-500">หมายเหตุ</label>
                  <p className="text-base text-gray-700">{assessment.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบข้อมูลการประเมินนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "กำลังลบ..." : "ลบข้อมูล"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}