// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Activity, ClipboardList, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [username, setUsername] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Get username from cookie (client-side parsing for display only)
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith('auth='));
    
    if (authCookie) {
      try {
        const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
        setUsername(authData.username || 'User');
      } catch {
        setUsername('User');
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('ออกจากระบบสำเร็จ');
        router.push('/');
      } else {
        toast.error('เกิดข้อผิดพลาดในการออกจากระบบ');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="min-h-screen bg-liner-to-b from-blue-50 to-white">
      {/* Header with logout */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ระบบคลินิก Asthma & COPD
                </h1>
                <p className="text-sm text-gray-500">
                  Clinical Documentation System
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-medium">{username}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              เลือกเมนูการทำงาน
            </h2>
            <p className="text-gray-600">
              Select your task
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Adult Form */}
            <Link href="/adult" className="group">
              <Card className="h-full border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-200 cursor-pointer">
                <CardHeader className="text-center space-y-4 pb-8">
                  <div className="flex justify-center">
                    <div className="bg-blue-100 p-6 rounded-full group-hover:bg-blue-200 transition-colors">
                      <Stethoscope className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">แบบฟอร์มผู้ใหญ่</CardTitle>
                    <CardDescription className="text-base">
                      Adult Assessment Form
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600">
                    บันทึกข้อมูลการประเมินผู้ป่วยผู้ใหญ่
                    <br />
                    Record adult patient assessment
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Child Form */}
            <Link href="/child" className="group">
              <Card className="h-full border-2 hover:border-green-500 hover:shadow-xl transition-all duration-200 cursor-pointer">
                <CardHeader className="text-center space-y-4 pb-8">
                  <div className="flex justify-center">
                    <div className="bg-green-100 p-6 rounded-full group-hover:bg-green-200 transition-colors">
                      <Activity className="w-12 h-12 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">แบบฟอร์มเด็ก</CardTitle>
                    <CardDescription className="text-base">
                      Pediatric Assessment Form
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600">
                    บันทึกข้อมูลการประเมินผู้ป่วยเด็ก
                    <br />
                    Record pediatric patient assessment
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Manage Data */}
            <Link href="/manage" className="group">
              <Card className="h-full border-2 hover:border-purple-500 hover:shadow-xl transition-all duration-200 cursor-pointer">
                <CardHeader className="text-center space-y-4 pb-8">
                  <div className="flex justify-center">
                    <div className="bg-purple-100 p-6 rounded-full group-hover:bg-purple-200 transition-colors">
                      <ClipboardList className="w-12 h-12 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">จัดการข้อมูล</CardTitle>
                    <CardDescription className="text-base">
                      Data Management
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600">
                    ดู ค้นหา และจัดการข้อมูลทั้งหมด
                    <br />
                    View, search and manage all data
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Info section */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">คำแนะนำการใช้งาน</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>เลือก <strong>แบบฟอร์มผู้ใหญ่</strong> หรือ <strong>แบบฟอร์มเด็ก</strong> เพื่อบันทึกข้อมูลผู้ป่วยใหม่</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>เลือก <strong>จัดการข้อมูล</strong> เพื่อดูและค้นหาข้อมูลผู้ป่วยที่บันทึกไว้</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>ระบบจะบันทึกชื่อผู้ใช้ของคุณในทุกการประเมิน</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}