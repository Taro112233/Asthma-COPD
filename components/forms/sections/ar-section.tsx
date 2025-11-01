// components/forms/sections/ar-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface ARData {
  symptoms: string;
  severity: 'MILD' | 'MOD_SEVERE' | '';
  pattern: 'INTERMITTENT' | 'PERSISTENT' | '';
}

interface ARSectionProps {
  ar: ARData;
  onARChange: (data: Partial<ARData>) => void;
}

export function ARSection({ ar, onARChange }: ARSectionProps) {
  return (
    <Card className="col-start-2 row-start-5 p-2">
      <Label className="text-xs font-semibold mb-0.5 block">AR</Label>
      <div className="space-y-1">
        <div>
          <Label className="text-xs mb-0.5 block">อาการ</Label>
          <Textarea
            value={ar.symptoms}
            onChange={(e) => onARChange({ symptoms: e.target.value })}
            className="text-xs h-12 resize-none"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={ar.severity === 'MILD'}
              onCheckedChange={(checked) => onARChange({ severity: checked ? 'MILD' : '' })}
              id="mild"
            />
            <Label htmlFor="mild" className="text-xs">Mild</Label>
          </div>
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={ar.severity === 'MOD_SEVERE'}
              onCheckedChange={(checked) => onARChange({ severity: checked ? 'MOD_SEVERE' : '' })}
              id="modsev"
            />
            <Label htmlFor="modsev" className="text-xs">Mod-Severe</Label>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={ar.pattern === 'INTERMITTENT'}
              onCheckedChange={(checked) => onARChange({ pattern: checked ? 'INTERMITTENT' : '' })}
              id="inter"
            />
            <Label htmlFor="inter" className="text-xs">Intermittent</Label>
          </div>
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={ar.pattern === 'PERSISTENT'}
              onCheckedChange={(checked) => onARChange({ pattern: checked ? 'PERSISTENT' : '' })}
              id="persist"
            />
            <Label htmlFor="persist" className="text-xs">Persistent</Label>
          </div>
        </div>
      </div>
    </Card>
  );
}