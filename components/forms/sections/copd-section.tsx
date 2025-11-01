// components/forms/sections/copd-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface COPDData {
  mMRC: string;
  cat: string;
  exacerbPerYear: string;
  fev1: string;
  sixMWD: string;
  stage: string;
}

interface COPDSectionProps {
  copd: COPDData;
  onCOPDChange: (data: Partial<COPDData>) => void;
}

export function COPDSection({ copd, onCOPDChange }: COPDSectionProps) {
  return (
    <Card className="col-start-2 row-start-4 p-2">
      <Label className="text-xs font-semibold mb-0.5 block">COPD</Label>
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs mb-0.5 block">mMRC</Label>
            <Input
              type="number"
              value={copd.mMRC}
              onChange={(e) => onCOPDChange({ mMRC: e.target.value })}
              className="h-6 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs mb-0.5 block">CAT</Label>
            <Input
              type="number"
              value={copd.cat}
              onChange={(e) => onCOPDChange({ cat: e.target.value })}
              className="h-6 text-xs"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs mb-0.5 block">Exacerb/yr</Label>
            <Input
              type="number"
              value={copd.exacerbPerYear}
              onChange={(e) => onCOPDChange({ exacerbPerYear: e.target.value })}
              className="h-6 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs mb-0.5 block">FEV1 %</Label>
            <Input
              type="number"
              value={copd.fev1}
              onChange={(e) => onCOPDChange({ fev1: e.target.value })}
              className="h-6 text-xs"
              placeholder=""
            />
          </div>
        </div>
        <div>
          <Label className="text-xs mb-0.5 block">6MWD</Label>
          <Input
            value={copd.sixMWD}
            onChange={(e) => onCOPDChange({ sixMWD: e.target.value })}
            className="h-6 text-xs"
          />
        </div>
      </div>
    </Card>
  );
}