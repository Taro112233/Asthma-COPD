// app/api/assessments/route.ts
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

// GET - List all assessments with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type'); // ADULT or CHILD
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.AssessmentWhereInput = {
      AND: [
        // Search filter
        search ? {
          OR: [
            { patient: { hospitalNumber: { contains: search, mode: 'insensitive' } } },
            { patient: { firstName: { contains: search, mode: 'insensitive' } } },
            { patient: { lastName: { contains: search, mode: 'insensitive' } } },
          ]
        } : {},
        // Patient type filter
        type ? { 
          patient: { 
            patientType: type as 'ADULT' | 'CHILD' 
          } 
        } : {}
      ]
    };

    // Get total count for pagination
    const total = await prisma.assessment.count({ where });

    // Get assessments
    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            hospitalNumber: true,
            firstName: true,
            lastName: true,
            patientType: true,
            height: true,
            dateOfBirth: true,
          }
        }
      },
      orderBy: { assessmentDate: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: assessments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('GET /api/assessments error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

// POST - Create new assessment
export async function POST(request: NextRequest) {
  try {
    const username = getUsernameFromCookie(request);
    const data = await request.json();

    // Validate required fields
    if (!data.hospitalNumber || !data.firstName || !data.lastName) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลที่จำเป็น: HN, ชื่อ, สกุล' },
        { status: 400 }
      );
    }

    if (!data.assessmentRound) {
      return NextResponse.json(
        { error: 'กรุณาเลือกรอบการประเมิน' },
        { status: 400 }
      );
    }

    if (!data.primaryDiagnosis) {
      return NextResponse.json(
        { error: 'กรุณาเลือกโรคหลัก' },
        { status: 400 }
      );
    }

    // Find or create patient
    let patient = await prisma.patient.findUnique({
      where: { hospitalNumber: data.hospitalNumber }
    });

    if (!patient) {
      // Create new patient
      patient = await prisma.patient.create({
        data: {
          hospitalNumber: data.hospitalNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          height: data.height ? new Prisma.Decimal(data.height) : null,
          patientType: data.patientType || 'ADULT',
          createdBy: username,
        }
      });
    } else {
      // Update patient info if changed
      if (patient.firstName !== data.firstName || 
          patient.lastName !== data.lastName || 
          (data.height && patient.height?.toString() !== data.height.toString())) {
        patient = await prisma.patient.update({
          where: { id: patient.id },
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            height: data.height ? new Prisma.Decimal(data.height) : patient.height,
          }
        });
      }
    }

    // Prepare technique steps data
    const techniqueSteps = {
      prepare: data.techniqueSteps?.prepare || {},
      inhale: data.techniqueSteps?.inhale || {},
      rinse: data.techniqueSteps?.rinse || {},
      empty: data.techniqueSteps?.empty || {},
    };

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        patientId: patient.id,
        
        // Meta information
        assessmentRound: data.assessmentRound,
        assessmentDate: new Date(data.assessmentDate),
        assessedBy: username,
        
        // Header (Adult-specific)
        alcohol: data.alcohol ?? null,
        alcoholAmount: data.alcoholAmount || null,
        smoking: data.smoking ?? null,
        smokingAmount: data.smokingAmount || null,
        
        // Header (Child-specific)
        accompaniedBy: data.accompaniedBy || null,
        age: data.age ?? null,
        predictedPEF: data.predictedPEF || null,
        
        // Diagnosis
        primaryDiagnosis: data.primaryDiagnosis,
        secondaryDiagnoses: data.secondaryDiagnoses || [],
        note: data.note || null,
        
        // Risk factors (Child only)
        riskFactors: data.riskFactors || null,
        
        // Disease-specific data
        asthmaData: data.asthmaData || null,
        copdData: data.copdData || null,
        arData: data.arData || null,
        
        // Compliance
        compliancePercent: data.compliancePercent || 0,
        complianceStatus: data.complianceStatus,
        cannotAssessReason: data.cannotAssessReason || null,
        nonComplianceReasons: data.nonComplianceReasons || [],
        nonComplianceOther: data.nonComplianceOther || null,
        
        // Side effects
        hasSideEffects: data.hasSideEffects || false,
        sideEffects: data.sideEffects || [],
        sideEffectsOther: data.sideEffectsOther || null,
        sideEffectsManagement: data.sideEffectsManagement || null,
        
        // Clinical assessment
        drps: data.drps || null,
        medicationStatus: data.medicationStatus,
        unopenedMedication: data.unopenedMedication ?? null,
        
        // Inhaler technique
        techniqueCorrect: data.techniqueCorrect || false,
        inhalerDevices: data.inhalerDevices || [],
        techniqueSteps: techniqueSteps,
        spacerType: data.spacerType || null,
        whoAdministers: data.whoAdministers || null,
        
        // Medications
        medications: data.medications || [],
      },
      include: {
        patient: true
      }
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error('POST /api/assessments error:', error);
    
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'ข้อมูลซ้ำกัน' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    );
  }
}