// components/forms/sections/drps-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DRPsSectionProps {
  drps: string;
  onDRPsChange: (value: string) => void;
}

export function DRPsSection({ drps, onDRPsChange }: DRPsSectionProps) {
  return (
    <Card className="col-span-2 col-start-3 row-start-6 p-2 h-full">
      <div className="flex items-center gap-2">
        <Label className="text-xs font-semibold">D. DRPs</Label>
        <Input
          value={drps}
          onChange={(e) => onDRPsChange(e.target.value)}
          className="h-6 text-xs flex-1"
          placeholder="Drug Related Problems"
        />
      </div>
    </Card>
  );
}