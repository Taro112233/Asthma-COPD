// app/api/admin/assessments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const diagnosis = searchParams.get('diagnosis') || 'all';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build where clause
    const where: any = {
      AND: []
    };

    // Search by HN, first name, or last name
    if (search) {
      where.AND.push({
        OR: [
          { patient: { hospitalNumber: { contains: search, mode: 'insensitive' } } },
          { patient: { firstName: { contains: search, mode: 'insensitive' } } },
          { patient: { lastName: { contains: search, mode: 'insensitive' } } }
        ]
      });
    }

    // Filter by diagnosis
    if (diagnosis !== 'all') {
      where.AND.push({
        primaryDiagnosis: diagnosis
      });
    }

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      where.AND.push({
        assessmentDate: { gte: fromDate }
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      where.AND.push({
        assessmentDate: { lte: toDate }
      });
    }

    // If no filters, remove AND array
    if (where.AND.length === 0) {
      delete where.AND;
    }

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        patient: {
          select: {
            hospitalNumber: true,
            firstName: true,
            lastName: true,
            age: true,
          }
        }
      },
      orderBy: { assessmentDate: 'desc' },
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