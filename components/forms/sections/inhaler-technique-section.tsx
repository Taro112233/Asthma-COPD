// components/forms/sections/inhaler-technique-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X } from 'lucide-react';

interface TechniqueSteps {
  prepare: { [device: string]: { status: 'correct' | 'incorrect' | 'none'; note: string } };
  inhale: { [device: string]: { status: 'correct' | 'incorrect' | 'none'; note: string } };
  rinse: { [device: string]: { status: 'correct' | 'incorrect' | 'none'; note: string } };
  empty: { [device: string]: { status: 'correct' | 'incorrect' | 'none'; note: string } };
}

interface InhalerTechniqueData {
  techniqueCorrect: boolean;
  techniqueSteps: TechniqueSteps;
  spacerType: string;
}

interface InhalerTechniqueSectionProps {
  technique: InhalerTechniqueData;
  onTechniqueChange: (data: Partial<InhalerTechniqueData>) => void;
}

const DEVICES = ['MDI', 'TURBO', 'ACCU', 'NS', 'HAND', 'ELLIPTA', 'SPIOLTO'];
const STEPS = ['Prepare', 'Inhale', 'Rinse', 'Empty'];
const SPACER_OPTIONS = [
  { value: 'MOUTH_PIECE', label: 'Mouth-piece' },
  { value: 'VOLUMETRIC', label: 'Volumetric' },
  { value: 'CONE', label: 'Cone' },
  { value: 'NONE', label: 'None' },
];

export function InhalerTechniqueSection({ technique, onTechniqueChange }: InhalerTechniqueSectionProps) {
  const handleStepClick = (step: string, device: string) => {
    const stepKey = step.toLowerCase() as keyof TechniqueSteps;
    const currentStatus = technique.techniqueSteps[stepKey]?.[device]?.status || 'none';
    
    let newStatus: 'correct' | 'incorrect' | 'none';
    if (currentStatus === 'none') {
      newStatus = 'correct';
    } else if (currentStatus === 'correct') {
      newStatus = 'incorrect';
    } else {
      newStatus = 'none';
    }

    onTechniqueChange({
      techniqueSteps: {
        ...technique.techniqueSteps,
        [stepKey]: {
          ...technique.techniqueSteps[stepKey],
          [device]: {
            status: newStatus,
            note: technique.techniqueSteps[stepKey]?.[device]?.note || '',
          }
        }
      }
    });
  };

  const handleNoteChange = (step: string, value: string) => {
    const stepKey = step.toLowerCase() as keyof TechniqueSteps;
    const activeDevice = Object.entries(technique.techniqueSteps[stepKey] || {})
      .find(([, val]) => val.status !== 'none')?.[0];

    if (activeDevice) {
      onTechniqueChange({
        techniqueSteps: {
          ...technique.techniqueSteps,
          [stepKey]: {
            ...technique.techniqueSteps[stepKey],
            [activeDevice]: {
              status: technique.techniqueSteps[stepKey][activeDevice].status,
              note: value,
            }
          }
        }
      });
    }
  };

  const renderStatusIcon = (status: 'correct' | 'incorrect' | 'none') => {
    if (status === 'correct') {
      return <Check className="w-4 h-4 text-green-600" />;
    } else if (status === 'incorrect') {
      return <X className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  return (
    <Card className="col-span-2 row-span-2 col-start-1 row-start-7 p-2 h-full">
      <div className="space-y-1">
        <div className="flex gap-4">
          <div className="flex items-center space-x-1.5">
            <Label className="text-xs font-semibold mb-0.5 block">เทคนิคการพ่นยา</Label>
            <Checkbox
              checked={technique.techniqueCorrect === true}
              onCheckedChange={(checked) => onTechniqueChange({ techniqueCorrect: !!checked })}
              id="tech-correct"
            />
            <Label htmlFor="tech-correct" className="text-xs">ถูกต้องทุกขั้นตอน</Label>
          </div>
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={technique.techniqueCorrect === false}
              onCheckedChange={(checked) => onTechniqueChange({ techniqueCorrect: !checked })}
              id="tech-incorrect"
            />
            <Label htmlFor="tech-incorrect" className="text-xs">ไม่ถูกต้อง</Label>
          </div>
        </div>

        {/* Technique Table */}
        <div className="border rounded text-xs">
          <div className="grid grid-cols-[80px_repeat(7,60px)_1fr] bg-gray-100 border-b">
            <div className="p-1 border-r font-semibold">รูปแบบ</div>
            {DEVICES.map(device => (
              <div key={device} className="p-1 border-r text-center">{device === 'TURBO' ? 'Turbu' : device}</div>
            ))}
            <div className="p-1">รายละเอียด</div>
          </div>

          {STEPS.map((step) => (
            <div key={step} className="grid grid-cols-[80px_repeat(7,60px)_1fr] border-b last:border-b-0">
              <div className="p-1 border-r font-medium">{step}</div>
              {DEVICES.map((device) => {
                const status = technique.techniqueSteps[step.toLowerCase() as keyof TechniqueSteps]?.[device]?.status || 'none';
                return (
                  <div 
                    key={device} 
                    className="p-1 border-r flex items-center justify-center cursor-pointer hover:bg-gray-50"
                    onClick={() => handleStepClick(step, device)}
                  >
                    {renderStatusIcon(status)}
                  </div>
                );
              })}
              <div className="p-0.5">
                <Input
                  value={
                    Object.entries(technique.techniqueSteps[step.toLowerCase() as keyof TechniqueSteps] || {})
                      .find(([, val]) => val.status !== 'none')?.[1]?.note || ''
                  }
                  onChange={(e) => handleNoteChange(step, e.target.value)}
                  className="h-5 text-xs border-0 focus-visible:ring-0"
                  placeholder="..."
                />
              </div>
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div>
          <div className="flex flex-wrap gap-2">
            <Label className="text-xs mb-0.5 block">Spacer</Label>
            {SPACER_OPTIONS.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-1.5">
                <Checkbox
                  checked={technique.spacerType === value}
                  onCheckedChange={(checked) => onTechniqueChange({
                    spacerType: checked ? value : ''
                  })}
                  id={`spacer-${value}`}
                />
                <Label htmlFor={`spacer-${value}`} className="text-xs">{label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}