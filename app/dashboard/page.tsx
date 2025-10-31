// app/dashboard/page.tsx
'use client';

import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { MenuCard } from '@/components/dashboard/menu-card';
import { InfoSection } from '@/components/dashboard/info-section';
import { useAuth } from '@/hooks/use-auth';
import { Stethoscope, Activity, ClipboardList } from 'lucide-react';

const MENU_ITEMS = [
  {
    href: '/adult',
    icon: Stethoscope,
    title: 'แบบฟอร์มผู้ใหญ่',
    subtitle: 'Adult Assessment Form',
    description: 'บันทึกข้อมูลการประเมินผู้ป่วยผู้ใหญ่<br />Record adult patient assessment',
    color: 'blue' as const
  },
  {
    href: '/child',
    icon: Activity,
    title: 'แบบฟอร์มเด็ก',
    subtitle: 'Pediatric Assessment Form',
    description: 'บันทึกข้อมูลการประเมินผู้ป่วยเด็ก<br />Record pediatric patient assessment',
    color: 'green' as const
  },
  {
    href: '/manage',
    icon: ClipboardList,
    title: 'จัดการข้อมูล',
    subtitle: 'Data Management',
    description: 'ดู ค้นหา และจัดการข้อมูลทั้งหมด<br />View, search and manage all data',
    color: 'purple' as const
  }
];

export default function DashboardPage() {
  const { username, handleLogout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardHeader username={username} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              เลือกเมนูการทำงาน
            </h2>
            <p className="text-gray-600">Select your task</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {MENU_ITEMS.map((item) => (
              <MenuCard key={item.href} {...item} />
            ))}
          </div>

          <InfoSection />
        </div>
      </div>
    </div>
  );
}