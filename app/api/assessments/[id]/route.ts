// app/api/assessments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

// Helper function to get username from cookie
function getUsernameFromCookie(request: NextRequest): string {
  const authCookie = request.cookies.get('auth');
  if (!authCookie) return 'Unknown';
  
  try {
    const authData = JSON.parse(authCookie.value);
    return authData.username || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

// GET - Get single assessment by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: params.id },
      include: {
        patient: {
          select: {
            id: true,
            hospitalNumber: true,
            firstName: true,
            lastName: true,
            nickname: true,
            patientType: true,
            height: true,
            dateOfBirth: true,
            createdAt: true,
            createdBy: true,
          }
        }
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
    console.error('GET /api/assessments/[id] error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

// PATCH - Update assessment
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const username = getUsernameFromCookie(request);
    const data = await request.json();

    // Check if assessment exists
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id: params.id },
      include: { patient: true }
    });

    if (!existingAssessment) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลการประเมิน' },
        { status: 404 }
      );
    }

    // Update patient info if provided
    if (data.firstName || data.lastName || data.height) {
      await prisma.patient.update({
        where: { id: existingAssessment.patientId },
        data: {
          firstName: data.firstName || existingAssessment.patient.firstName,
          lastName: data.lastName || existingAssessment.patient.lastName,
          height: data.height 
            ? new Prisma.Decimal(data.height) 
            : existingAssessment.patient.height,
        }
      });
    }

    // Prepare technique steps data if provided
    const techniqueSteps = data.techniqueSteps ? {
      prepare: data.techniqueSteps.prepare || {},
      inhale: data.techniqueSteps.inhale || {},
      rinse: data.techniqueSteps.rinse || {},
      empty: data.techniqueSteps.empty || {},
    } : undefined;

    // Update assessment
    const updatedAssessment = await prisma.assessment.update({
      where: { id: params.id },
      data: {
        // Meta information
        ...(data.assessmentRound && { assessmentRound: data.assessmentRound }),
        ...(data.assessmentDate && { assessmentDate: new Date(data.assessmentDate) }),
        
        // Header (Adult-specific)
        ...(data.alcohol !== undefined && { alcohol: data.alcohol }),
        ...(data.alcoholAmount !== undefined && { alcoholAmount: data.alcoholAmount || null }),
        ...(data.smoking !== undefined && { smoking: data.smoking }),
        ...(data.smokingAmount !== undefined && { smokingAmount: data.smokingAmount || null }),
        
        // Header (Child-specific)
        ...(data.accompaniedBy !== undefined && { accompaniedBy: data.accompaniedBy || null }),
        ...(data.age !== undefined && { age: data.age }),
        ...(data.predictedPEF !== undefined && { predictedPEF: data.predictedPEF || null }),
        
        // Diagnosis
        ...(data.primaryDiagnosis && { primaryDiagnosis: data.primaryDiagnosis }),
        ...(data.secondaryDiagnoses && { secondaryDiagnoses: data.secondaryDiagnoses }),
        ...(data.note !== undefined && { note: data.note || null }),
        
        // Risk factors (Child only)
        ...(data.riskFactors !== undefined && { riskFactors: data.riskFactors }),
        
        // Disease-specific data
        ...(data.asthmaData !== undefined && { asthmaData: data.asthmaData }),
        ...(data.copdData !== undefined && { copdData: data.copdData }),
        ...(data.arData !== undefined && { arData: data.arData }),
        
        // Compliance
        ...(data.compliancePercent !== undefined && { compliancePercent: data.compliancePercent }),
        ...(data.complianceStatus && { complianceStatus: data.complianceStatus }),
        ...(data.cannotAssessReason !== undefined && { cannotAssessReason: data.cannotAssessReason || null }),
        ...(data.nonComplianceReasons && { nonComplianceReasons: data.nonComplianceReasons }),
        ...(data.nonComplianceOther !== undefined && { nonComplianceOther: data.nonComplianceOther || null }),
        
        // Side effects
        ...(data.hasSideEffects !== undefined && { hasSideEffects: data.hasSideEffects }),
        ...(data.sideEffects && { sideEffects: data.sideEffects }),
        ...(data.sideEffectsOther !== undefined && { sideEffectsOther: data.sideEffectsOther || null }),
        ...(data.sideEffectsManagement !== undefined && { sideEffectsManagement: data.sideEffectsManagement || null }),
        
        // Clinical assessment
        ...(data.drps !== undefined && { drps: data.drps || null }),
        ...(data.medicationStatus && { medicationStatus: data.medicationStatus }),
        ...(data.unopenedMedication !== undefined && { unopenedMedication: data.unopenedMedication }),
        
        // Inhaler technique
        ...(data.techniqueCorrect !== undefined && { techniqueCorrect: data.techniqueCorrect }),
        ...(data.inhalerDevices && { inhalerDevices: data.inhalerDevices }),
        ...(techniqueSteps && { techniqueSteps }),
        ...(data.spacerType !== undefined && { spacerType: data.spacerType || null }),
        ...(data.whoAdministers !== undefined && { whoAdministers: data.whoAdministers || null }),
        
        // Medications
        ...(data.medications && { medications: data.medications }),
      },
      include: {
        patient: true
      }
    });

    return NextResponse.json(updatedAssessment);
  } catch (error) {
    console.error('PATCH /api/assessments/[id] error:', error);
    
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'ไม่พบข้อมูลที่ต้องการแก้ไข' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' },
      { status: 500 }
    );
  }
}

// DELETE - Delete assessment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if assessment exists
    const assessment = await prisma.assessment.findUnique({
      where: { id: params.id }
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลการประเมิน' },
        { status: 404 }
      );
    }

    // Delete assessment
    await prisma.assessment.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      success: true,
      message: 'ลบข้อมูลสำเร็จ' 
    });
  } catch (error) {
    console.error('DELETE /api/assessments/[id] error:', error);
    
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'ไม่พบข้อมูลที่ต้องการลบ' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    );
  }
}