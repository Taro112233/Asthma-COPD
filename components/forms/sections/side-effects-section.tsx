// components/forms/sections/side-effects-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface SideEffectsData {
  hasSideEffects: boolean;
  oralCandidiasis: boolean;
  hoarseVoice: boolean;
  palpitation: boolean;
  other: string;
}

interface SideEffectsSectionProps {
  sideEffects: SideEffectsData;
  onSideEffectsChange: (data: Partial<SideEffectsData>) => void;
}

const SIDE_EFFECT_OPTIONS = [
  { key: 'oralCandidiasis', label: 'เชื้อราในปาก' },
  { key: 'hoarseVoice', label: 'เสียงแหบ' },
  { key: 'palpitation', label: 'ใจสั่น' },
];

export function SideEffectsSection({ sideEffects, onSideEffectsChange }: SideEffectsSectionProps) {
  return (
    <Card className="col-span-2 col-start-3 row-start-5 p-2 h-full">
      <Label className="text-xs font-semibold mb-0.5 block">ผลข้างเคียงจากการใช้ยา</Label>
      <div className="space-y-1">
        <div className="flex gap-4">
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={sideEffects.hasSideEffects === true}
              onCheckedChange={(checked) => onSideEffectsChange({ hasSideEffects: !!checked })}
              id="se-yes"
            />
            <Label htmlFor="se-yes" className="text-xs">เกิด</Label>
          </div>
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={sideEffects.hasSideEffects === false}
              onCheckedChange={(checked) => onSideEffectsChange({ hasSideEffects: !checked })}
              id="se-no"
            />
            <Label htmlFor="se-no" className="text-xs">ไม่เกิด</Label>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {SIDE_EFFECT_OPTIONS.map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-1.5">
              <Checkbox
                checked={sideEffects[key as keyof SideEffectsData] as boolean}
                onCheckedChange={(checked) => onSideEffectsChange({ [key]: !!checked })}
                id={`se-${key}`}
              />
              <Label htmlFor={`se-${key}`} className="text-xs">{label}</Label>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Label className="text-xs">อื่น ๆ</Label>
          <Input
            value={sideEffects.other}
            onChange={(e) => onSideEffectsChange({ other: e.target.value })}
            className="h-6 text-xs flex-1"
            placeholder="ระบุผลข้างเคียงอื่น ๆ"
          />
        </div>
      </div>
    </Card>
  );
}