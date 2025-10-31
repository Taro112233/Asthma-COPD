// components/dashboard/info-section.tsx
export function InfoSection() {
  return (
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
  );
}