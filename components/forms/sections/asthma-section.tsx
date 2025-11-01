// components/forms/sections/asthma-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface AsthmaData {
  pef: string;
  pefPercent: string;
  day: string;
  night: string;
  rescue: string;
  er: string;
  admit: string;
  controlLevel: string;
}

interface AsthmaSectionProps {
  asthma: AsthmaData;
  onAsthmaChange: (data: Partial<AsthmaData>) => void;
}

const CONTROL_LEVELS = [
  { value: 'WELL', label: 'Well (0 ข้อ)' },
  { value: 'PARTLY', label: 'Partly (1-2 ข้อ)' },
  { value: 'UNCONTROLLED', label: 'Uncontrolled (3-4 ข้อ)' },
];

export function AsthmaSection({ asthma, onAsthmaChange }: AsthmaSectionProps) {
  return (
    <Card className="row-span-2 col-start-1 row-start-4 p-2">
      <Label className="text-xs font-semibold mb-0.5 block">Asthma</Label>
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs mb-0.5 block">PEF</Label>
            <Input
              value={asthma.pef}
              onChange={(e) => onAsthmaChange({ pef: e.target.value })}
              className="h-6 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs mb-0.5 block">%PEF</Label>
            <Input
              value={asthma.pefPercent}
              onChange={(e) => onAsthmaChange({ pefPercent: e.target.value })}
              className="h-6 text-xs"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs mb-0.5 block">Limited activity</Label>
          <div className="grid grid-cols-5 gap-1">
            {[
              { key: 'day', label: 'Day' },
              { key: 'night', label: 'Night' },
              { key: 'rescue', label: 'Rescue' },
              { key: 'er', label: 'ER' },
              { key: 'admit', label: 'Admit' },
            ].map(({ key, label }) => (
              <div key={key}>
                <Label className="text-xs mb-0.5 block">{label}</Label>
                <Input
                  type="number"
                  value={asthma[key as keyof AsthmaData]}
                  onChange={(e) => onAsthmaChange({ [key]: e.target.value })}
                  className="h-6 text-xs"
                  placeholder=""
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-xs mb-0.5 block">Level of controlled</Label>
          <div className="grid grid-cols-1 gap-0.5">
            {CONTROL_LEVELS.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-1.5">
                <Checkbox
                  checked={asthma.controlLevel === value}
                  onCheckedChange={(checked) => onAsthmaChange({ controlLevel: checked ? value : '' })}
                  id={`control-${value}`}
                />
                <Label htmlFor={`control-${value}`} className="text-xs">{label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}