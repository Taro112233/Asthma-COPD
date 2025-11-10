// app/api/assessments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Get single assessment by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        patient: true
      }
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลการประเมิน' },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Get assessment error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

// PATCH - Update assessment
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // ดึงข้อมูล assessment เดิมเพื่อเอา hospitalNumber
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id },
      select: { hospitalNumber: true }
    });

    if (!existingAssessment) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลการประเมิน' },
        { status: 404 }
      );
    }

    // อัปเดตข้อมูล patient ก่อน (ยกเว้น HN)
    await prisma.patient.update({
      where: { hospitalNumber: existingAssessment.hospitalNumber },
      data: {
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        age: data.age || undefined, // เพิ่มการอัปเดต age
        updatedAt: new Date(),
      }
    });

    // จากนั้นค่อยอัปเดต assessment
    const assessment = await prisma.assessment.update({
      where: { id },
      data: {
        assessmentRound: data.assessmentRound || undefined,
        assessmentDate: data.assessmentDate ? new Date(data.assessmentDate) : undefined,
        
        // Header
        alcohol: data.alcohol,
        alcoholAmount: data.alcoholAmount,
        smoking: data.smoking,
        smokingAmount: data.smokingAmount,
        
        // Diagnosis
        primaryDiagnosis: data.primaryDiagnosis || undefined,
        secondaryDiagnoses: data.secondaryDiagnoses,
        note: data.note,
        
        // Disease-specific data
        asthmaData: data.asthmaData,
        copdData: data.copdData,
        arData: data.arData,
        
        // Compliance
        complianceStatus: data.complianceStatus || undefined,
        compliancePercent: data.compliancePercent,
        cannotAssessReason: data.cannotAssessReason,
        
        // Non-compliance reasons
        nonComplianceReasons: data.nonComplianceReasons,
        lessThanDetail: data.lessThanDetail,
        moreThanDetail: data.moreThanDetail,
        nonComplianceOther: data.nonComplianceOther,
        
        // Side effects
        hasSideEffects: data.hasSideEffects,
        sideEffects: data.sideEffects,
        sideEffectsOther: data.sideEffectsOther,
        sideEffectsManagement: data.sideEffectsManagement,
        
        // Clinical
        drps: data.drps,
        
        // Medication status
        medicationStatus: data.medicationStatus || undefined,
        unopenedMedication: data.unopenedMedication,
        
        // Inhaler technique
        techniqueCorrect: data.techniqueCorrect,
        inhalerDevices: data.inhalerDevices,
        techniqueSteps: data.techniqueSteps,
        spacerType: data.spacerType,
        
        // Medications
        medications: data.medications,
        
        updatedAt: new Date(),
      },
      include: {
        patient: true
      }
    });

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Update assessment error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล' },
      { status: 500 }
    );
  }
}

// DELETE - Delete assessment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.assessment.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'ลบข้อมูลสำเร็จ' });
  } catch (error) {
    console.error('Delete assessment error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    );
  }
}