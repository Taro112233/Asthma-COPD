// components/forms/sections/drps-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DRPsSectionProps {
  drps: string;
  onDRPsChange: (value: string) => void;
}

export function DRPsSection({ drps, onDRPsChange }: DRPsSectionProps) {
  return (
    <Card className="col-span-2 col-start-3 row-start-6 p-2 h-full">
      <Label className="text-xs font-semibold mb-0.5 block">C. DRPs</Label>
      <Textarea
        value={drps}
        onChange={(e) => onDRPsChange(e.target.value)}
        className="text-xs h-16 resize-none"
        placeholder="Drug Related Problems"
      />
    </Card>
  );
}