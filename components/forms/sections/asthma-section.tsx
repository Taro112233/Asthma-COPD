// components/forms/sections/asthma-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

export function AsthmaSection({ asthma, onAsthmaChange }: AsthmaSectionProps) {
  return (
    <Card className="row-span-2 col-start-1 row-start-4 p-2 h-full">
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
            <Label className="text-xs mb-0.5 block">( _________ %)</Label>
            <Input
              type="number"
              value={asthma.pefPercent}
              onChange={(e) => onAsthmaChange({ pefPercent: e.target.value })}
              className="h-6 text-xs"
              placeholder="%"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-xs mb-0.5 block">Limited activity</Label>
          <div className="grid grid-cols-5 gap-1">
            {[
              { key: 'day', label: 'Day', max: 8 },
              { key: 'night', label: 'Night', max: 0 },
              { key: 'rescue', label: 'Rescue', max: 8 },
              { key: 'er', label: 'ER', max: 0 },
              { key: 'admit', label: 'Admit', max: 0 },
            ].map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center">
                <Label className="text-[10px] mt-0.5">{label}</Label>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1 mt-1">
            {['day', 'night', 'rescue', 'er', 'admit'].map((key) => (
              <Input
                key={key}
                type="number"
                min="0"
                value={asthma[key as keyof AsthmaData]}
                onChange={(e) => onAsthmaChange({ [key]: e.target.value })}
                className="h-6 text-xs text-center"
              />
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-xs mb-0.5 block">Level of controlled</Label>
          <RadioGroup
            value={asthma.controlLevel}
            onValueChange={(value) => onAsthmaChange({ controlLevel: value })}
            className="space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="WELL" id="control-well" />
              <Label htmlFor="control-well" className="text-xs cursor-pointer">
                Well controlled (0 ข้อ)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PARTLY" id="control-partly" />
              <Label htmlFor="control-partly" className="text-xs cursor-pointer">
                Partly (1 - 2 ข้อ)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="UNCONTROLLED" id="control-uncontrolled" />
              <Label htmlFor="control-uncontrolled" className="text-xs cursor-pointer">
                Uncontrolled (3 - 4 ข้อ)
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </Card>
  );
}