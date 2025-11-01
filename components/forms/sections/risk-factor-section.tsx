// components/forms/sections/risk-factor-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface RiskFactorSectionProps {
  note: string;
  onNoteChange: (value: string) => void;
}

export function RiskFactorSection({ note, onNoteChange }: RiskFactorSectionProps) {
  return (
    <Card className="col-span-2 col-start-1 row-start-3 p-2 h-full">
      <Label className="text-xs font-semibold mb-0.5 block">Note/Risk factor</Label>
      <Textarea
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        className="text-xs h-16 resize-none"
        placeholder="บันทึกปัจจัยเสี่ยง..."
      />
    </Card>
  );
}