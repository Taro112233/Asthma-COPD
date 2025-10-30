import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Activity, Users, FileText, Shield, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ระบบบันทึกข้อมูลคลินิก
          </h1>
          <h2 className="text-3xl font-semibold text-blue-600 mb-6">
            Asthma & COPD Monitoring
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            ระบบบริหารจัดการข้อมูลผู้ป่วยโรคระบบทางเดินหายใจเรื้อรัง
            <br />
            รองรับการบันทึกทั้งผู้ใหญ่และเด็ก พร้อมการติดตามผลการรักษาอย่างเป็นระบบ
          </p>
          
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
              เข้าสู่ระบบ
              <Shield className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">จัดการผู้ป่วย</CardTitle>
              <CardDescription className="text-base">
                บันทึกข้อมูลผู้ป่วยทั้งผู้ใหญ่และเด็ก พร้อมระบบค้นหาด้วย HN
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">ติดตามอาการ</CardTitle>
              <CardDescription className="text-base">
                ประเมินผล Pre/Post Counseling พร้อมการวัดค่า PEF, mMRC, CAT
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">บันทึกครบถ้วน</CardTitle>
              <CardDescription className="text-base">
                ข้อมูล Compliance, Side Effects, Inhaler Technique
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-xl">วิเคราะห์ผล</CardTitle>
              <CardDescription className="text-base">
                ติดตามความคืบหน้าการรักษาและประเมินผลลัพธ์
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">ปลอดภัย</CardTitle>
              <CardDescription className="text-base">
                ระบบ Authentication และการเก็บข้อมูลอย่างปลอดภัย
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                <Stethoscope className="w-6 h-6 text-cyan-600" />
              </div>
              <CardTitle className="text-xl">มาตรฐานการรักษา</CardTitle>
              <CardDescription className="text-base">
                ตาม Clinical Practice Guidelines สากล
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            ระบบพัฒนาเพื่อใช้ในการบันทึกข้อมูลคลินิกโรคระบบทางเดินหายใจเรื้อรัง
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © 2025 Asthma & COPD Clinic Management System
          </p>
        </div>
      </div>
    </div>
  );
}