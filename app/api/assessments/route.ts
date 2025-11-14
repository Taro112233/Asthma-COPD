// app/api/assessments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - List all assessments with search/filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');

    const assessments = await prisma.assessment.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { patient: { hospitalNumber: { contains: search, mode: 'insensitive' } } },
              { patient: { firstName: { contains: search, mode: 'insensitive' } } },
              { patient: { lastName: { contains: search, mode: 'insensitive' } } }
            ]
          } : {},
        ]
      },
      include: {
        patient: {
          select: {
            hospitalNumber: true,
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: { assessmentDate: 'desc' },
      take: 100,
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Get assessments error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

// POST - Create new assessment
export async function POST(request: NextRequest) {
  try {
    // ✅ ดึง username จาก cookie
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

    // Validate required field
    if (!data.hospitalNumber) {
      return NextResponse.json(
        { error: 'กรุณาระบุ HN' },
        { status: 400 }
      );
    }

    // Create or update patient (upsert)
    await prisma.patient.upsert({
      where: { hospitalNumber: data.hospitalNumber },
      update: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        age: data.age || null,
        updatedAt: new Date(),
      },
      create: {
        hospitalNumber: data.hospitalNumber,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        age: data.age || null,
        createdBy: username,
      }
    });

    // ✅ Process techniqueSteps - ensure proper structure with device-specific notes
    const processedTechniqueSteps = data.techniqueSteps || {
      prepare: {},
      inhale: {},
      rinse: {},
      empty: {}
    };

    // Validate techniqueSteps structure
    ['prepare', 'inhale', 'rinse', 'empty'].forEach(step => {
      if (!processedTechniqueSteps[step]) {
        processedTechniqueSteps[step] = {};
      }
      
      // Ensure each device entry has correct structure
      Object.keys(processedTechniqueSteps[step]).forEach(device => {
        const entry = processedTechniqueSteps[step][device];
        if (!entry || typeof entry !== 'object') {
          processedTechniqueSteps[step][device] = { status: 'none', note: '' };
        } else {
          processedTechniqueSteps[step][device] = {
            status: entry.status || 'none',
            note: entry.note || ''
          };
        }
      });
    });

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        hospitalNumber: data.hospitalNumber,
        assessmentDate: data.assessmentDate ? new Date(data.assessmentDate) : new Date(),
        assessedBy: username,
        
        // Header
        alcohol: data.alcohol || null,
        alcoholAmount: data.alcoholAmount || null,
        smoking: data.smoking || null,
        smokingAmount: data.smokingAmount || null,
        
        // Diagnosis
        primaryDiagnosis: data.primaryDiagnosis || null,
        secondaryDiagnoses: data.secondaryDiagnoses || [],
        note: data.note || null,
        
        // Disease-specific data
        asthmaData: data.asthmaData || null,
        copdData: data.copdData || null,
        arData: data.arData || null,
        
        // Compliance
        complianceStatus: data.complianceStatus || null,
        compliancePercent: data.compliancePercent || 0,
        cannotAssessReason: data.cannotAssessReason || null,
        
        // Non-compliance reasons
        nonComplianceReasons: data.nonComplianceReasons || [],
        lessThanDetail: data.lessThanDetail || null,
        moreThanDetail: data.moreThanDetail || null,
        nonComplianceOther: data.nonComplianceOther || null,
        
        // Side effects
        hasSideEffects: data.hasSideEffects || false,
        sideEffects: data.sideEffects || [],
        sideEffectsOther: data.sideEffectsOther || null,
        sideEffectsManagement: data.sideEffectsManagement || null,
        
        // Clinical
        drps: data.drps || null,
        
        // Medication status
        medicationStatus: data.medicationStatus || null,
        unopenedMedication: data.unopenedMedication || false,
        
        // ✅ Inhaler technique - with device-specific notes
        // techniqueCorrect รองรับ 3 states: true (ถูกต้อง), false (ผิด), null (ไม่เลือก)
        techniqueCorrect: data.techniqueCorrect === true ? true : data.techniqueCorrect === false ? false : null,
        inhalerDevices: data.inhalerDevices || [],
        techniqueSteps: processedTechniqueSteps,
        spacerType: data.spacerType || null,
        
        // Medications
        medications: data.medications || null,
      },
      include: {
        patient: true
      }
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error('Create assessment error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    );
  }
}