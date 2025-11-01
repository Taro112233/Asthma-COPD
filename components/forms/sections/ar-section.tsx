// components/forms/sections/ar-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
    <Card className="col-start-2 row-start-5 p-2 h-full">
      <Label className="text-xs font-semibold mb-0.5 block">AR</Label>
      <div className="space-y-1.5">
        <div>
          <Label className="text-xs mb-0.5 block">อาการ</Label>
          <Textarea
            value={ar.symptoms}
            onChange={(e) => onARChange({ symptoms: e.target.value })}
            className="text-xs h-16 resize-none"
            placeholder="บันทึกอาการ..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <RadioGroup
              value={ar.severity}
              onValueChange={(value) => onARChange({ severity: value as 'MILD' | 'MOD_SEVERE' })}
              className="space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MILD" id="ar-mild" />
                <Label htmlFor="ar-mild" className="text-xs cursor-pointer">Mild</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MOD_SEVERE" id="ar-modsev" />
                <Label htmlFor="ar-modsev" className="text-xs cursor-pointer">Mod-Severe</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <RadioGroup
              value={ar.pattern}
              onValueChange={(value) => onARChange({ pattern: value as 'INTERMITTENT' | 'PERSISTENT' })}
              className="space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="INTERMITTENT" id="ar-inter" />
                <Label htmlFor="ar-inter" className="text-xs cursor-pointer">Intermittent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PERSISTENT" id="ar-persist" />
                <Label htmlFor="ar-persist" className="text-xs cursor-pointer">Persistent</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </Card>
  );
}