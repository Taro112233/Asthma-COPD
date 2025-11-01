// components/forms/sections/date-round-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface DateRoundSectionProps {
  assessmentDate: string;
  assessmentRound: string;
  onDateChange: (date: string) => void;
  onRoundChange: (round: 'PRE_COUNSELING' | 'POST_COUNSELING' | '') => void;
}

export function DateRoundSection({ 
  assessmentDate, 
  assessmentRound, 
  onDateChange, 
  onRoundChange 
}: DateRoundSectionProps) {
  return (
    <Card className="col-span-2 p-2">
      <div className="grid grid-cols-3 gap-2 items-center">
        <div>
          <Input
            type="date"
            value={assessmentDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="h-7 text-xs"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={assessmentRound === 'PRE_COUNSELING'}
            onCheckedChange={(checked) => onRoundChange(checked ? 'PRE_COUNSELING' : '')}
            id="pre"
          />
          <Label htmlFor="pre" className="text-xs">Pre-counseling</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={assessmentRound === 'POST_COUNSELING'}
            onCheckedChange={(checked) => onRoundChange(checked ? 'POST_COUNSELING' : '')}
            id="post"
          />
          <Label htmlFor="post" className="text-xs">Post-counseling</Label>
        </div>
      </div>
    </Card>
  );
}