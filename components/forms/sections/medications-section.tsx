// components/forms/sections/medications-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface MedicationsData {
  medicationStatus: 'NO_REMAINING' | 'HAS_REMAINING' | '';
  budesonide: string;
  seretide25_125: string;
  seretide50_250: string;
  seretideAccu: string;
  symbicort160: string;
  symbicort320: string;
  ventolinMDI: string;
  berodualMDI: string;
  avamysNS: string;
  theophylline: string;
  montelukast: string;
  spirivaHand: string;
  ellipta: string;
  spiolto: string;
  other: string;
}

interface MedicationsSectionProps {
  medications: MedicationsData;
  onMedicationsChange: (data: Partial<MedicationsData>) => void;
}

const MEDICATION_LIST = [
  { key: 'budesonide', label: 'Budesonide' },
  { key: 'seretide25_125', label: 'Seretide 25/125' },
  { key: 'seretide50_250', label: 'Seretide 50/250' },
  { key: 'seretideAccu', label: 'Seretide Accu' },
  { key: 'symbicort160', label: 'Symbicort 160' },
  { key: 'symbicort320', label: 'Symbicort 320' },
  { key: 'ventolinMDI', label: 'Ventolin MDI' },
  { key: 'berodualMDI', label: 'Berodual MDI' },
  { key: 'avamysNS', label: 'Avamys NS' },
  { key: 'theophylline', label: 'Theophylline' },
  { key: 'montelukast', label: 'Montelukast' },
  { key: 'spirivaHand', label: 'Spiriva Hand' },
  { key: 'ellipta', label: 'Ellipta' },
  { key: 'spiolto', label: 'Spiolto' },
];

export function MedicationsSection({ medications, onMedicationsChange }: MedicationsSectionProps) {
  return (
    <Card className="col-span-2 row-span-2 col-start-3 row-start-7 p-2">
      <Label className="text-xs font-semibold mb-0.5 block">D. ร้านขายเหลือ</Label>
      <div className="space-y-1">
        <div className="flex gap-4">
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={medications.medicationStatus === 'NO_REMAINING'}
              onCheckedChange={(checked) => onMedicationsChange({ 
                medicationStatus: checked ? 'NO_REMAINING' : '' 
              })}
              id="no-remain"
            />
            <Label htmlFor="no-remain" className="text-xs">ไม่เหลือยา</Label>
          </div>
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={medications.medicationStatus === 'HAS_REMAINING'}
              onCheckedChange={(checked) => onMedicationsChange({ 
                medicationStatus: checked ? 'HAS_REMAINING' : '' 
              })}
              id="has-remain"
            />
            <Label htmlFor="has-remain" className="text-xs">เหลือยาที่ยังไม่เปิดกล่อง</Label>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-x-2 gap-y-1">
          {MEDICATION_LIST.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1">
              <Label className="text-xs w-24 truncate" title={label}>{label}</Label>
              <Input
                type="number"
                value={medications[key as keyof MedicationsData]}
                onChange={(e) => onMedicationsChange({ [key]: e.target.value })}
                className="h-6 text-xs w-14"
              />
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Label className="text-xs">อื่น ๆ</Label>
          <Input
            value={medications.other}
            onChange={(e) => onMedicationsChange({ other: e.target.value })}
            className="h-6 text-xs flex-1"
            placeholder="ระบุยาอื่น ๆ"
          />
        </div>
      </div>
    </Card>
  );
}