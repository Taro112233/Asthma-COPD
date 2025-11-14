// app/api/assessments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - (ไม่เปลี่ยนแปลง)
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

// PATCH - Update assessment (มีการเปลี่ยนแปลง)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // ✅ ดึง username (เหมือนเดิม)
    const cookies = request.headers.get('cookie');
    const authCookie = cookies?.split(';').find(c => c.trim().startsWith('auth='));
    
    let username = 'Unknown';
    if (authCookie) {
      try {
        const authValue = decodeURIComponent(authCookie.split('=')[1]);
        const authData = JSON.parse(authValue);
        username = authData.username || 'Unknown';
      } catch (error) {
        console.error('Failed to parse auth cookie:', error);
      }
    }

    const data = await request.json();

    // ดึงข้อมูล assessment เดิม (เหมือนเดิม)
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

    // อัปเดต patient (เหมือนเดิม)
    await prisma.patient.update({
      where: { hospitalNumber: existingAssessment.hospitalNumber },
      data: {
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        age: data.age || undefined,
        updatedAt: new Date(),
      }
    });

    // ✅ Process techniqueSteps - กรอง status 'none' ออก
    const STEPS = ['prepare', 'inhale', 'rinse', 'empty'];
    const processedTechniqueSteps: { [key: string]: any } = {};
    const deviceSet = new Set<string>(); // ✅ Set สำหรับเก็บ device ที่ใช้งานจริง

    STEPS.forEach(step => {
      const stepData = data.techniqueSteps?.[step];
      if (stepData) {
        // กรองเฉพาะ entry ที่ status ไม่ใช่ 'none'
        const filteredEntries = Object.entries(stepData)
          .filter(([device, details]: [string, any]) => 
            details && details.status !== 'none' && (details.status === 'correct' || details.status === 'incorrect')
          )
          .map(([device, details]: [string, any]) => {
            deviceSet.add(device); // ✅ เพิ่ม device ที่ผ่านการกรองเข้า Set
            return [device, { // คืนค่าโครงสร้างเดิม
              status: details.status,
              note: details.note || ''
            }];
          });
        
        processedTechniqueSteps[step] = Object.fromEntries(filteredEntries);
      } else {
        // ถ้าไม่มี step data ให้ khởi tạo เป็น object ว่าง
        processedTechniqueSteps[step] = {};
      }
    });

    // ✅ สร้าง inhalerDevices list ขึ้นมาใหม่จาก Set
    const processedInhalerDevices = [...deviceSet];

    // จากนั้นค่อยอัปเดต assessment
    const assessment = await prisma.assessment.update({
      where: { id },
      data: {
        assessmentDate: data.assessmentDate ? new Date(data.assessmentDate) : undefined,
        assessedBy: username,
        
        // ... (ส่วนอื่นๆ เหมือนเดิม) ...
        alcohol: data.alcohol,
        alcoholAmount: data.alcoholAmount,
        smoking: data.smoking,
        smokingAmount: data.smokingAmount,
        primaryDiagnosis: data.primaryDiagnosis || undefined,
        secondaryDiagnoses: data.secondaryDiagnoses,
        note: data.note,
        asthmaData: data.asthmaData,
        copdData: data.copdData,
        arData: data.arData,
        complianceStatus: data.complianceStatus || undefined,
        compliancePercent: data.compliancePercent,
        cannotAssessReason: data.cannotAssessReason,
        nonComplianceReasons: data.nonComplianceReasons,
        lessThanDetail: data.lessThanDetail,
        moreThanDetail: data.moreThanDetail,
        nonComplianceOther: data.nonComplianceOther,
        hasSideEffects: data.hasSideEffects,
        sideEffects: data.sideEffects,
        sideEffectsOther: data.sideEffectsOther,
        sideEffectsManagement: data.sideEffectsManagement,
        drps: data.drps,
        medicationStatus: data.medicationStatus || undefined,
        unopenedMedication: data.unopenedMedication,
        
        // ✅ Inhaler technique - ใช้ข้อมูลที่ผ่านการ process แล้ว
        techniqueCorrect: data.techniqueCorrect === true ? true : data.techniqueCorrect === false ? false : null,
        inhalerDevices: processedInhalerDevices, // ✅ ใช้ list ที่สร้างใหม่
        techniqueSteps: processedTechniqueSteps, // ✅ ใช้ steps ที่กรองแล้ว
        spacerType: data.spacerType,
        
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

// DELETE - (ไม่เปลี่ยนแปลง)
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