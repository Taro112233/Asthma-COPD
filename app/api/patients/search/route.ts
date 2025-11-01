// app/api/patients/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Search patient by HN
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hn = searchParams.get('hn');

    if (!hn) {
      return NextResponse.json(
        { error: 'กรุณาระบุ HN' },
        { status: 400 }
      );
    }

    // Search for patient
    const patient = await prisma.patient.findUnique({
      where: { hospitalNumber: hn },
      include: {
        assessments: {
          orderBy: { assessmentDate: 'desc' },
          take: 5, // Get last 5 assessments
          select: {
            id: true,
            assessmentDate: true,
            assessmentRound: true,
            primaryDiagnosis: true,
            compliancePercent: true,
            assessedBy: true,
          }
        }
      }
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลผู้ป่วย' },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('GET /api/patients/search error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการค้นหา' },
      { status: 500 }
    );
  }
}