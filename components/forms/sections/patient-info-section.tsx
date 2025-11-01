// components/forms/sections/patient-info-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Search } from 'lucide-react';

interface PatientInfoSectionProps {
  hospitalNumber: string;
  firstName: string;
  lastName: string;
  height: string;
  alcohol: string;
  alcoholAmount: string;
  smoking: string;
  smokingAmount: string;
  isSearching: boolean;
  onHospitalNumberChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onAlcoholChange: (value: 'YES' | 'NO' | '') => void;
  onAlcoholAmountChange: (value: string) => void;
  onSmokingChange: (value: 'YES' | 'NO' | '') => void;
  onSmokingAmountChange: (value: string) => void;
  onSearch: () => void;
}

export function PatientInfoSection(props: PatientInfoSectionProps) {
  return (
    <Card className="col-span-2 col-start-3 p-2">
      <div className="space-y-1">
        <div className="grid grid-cols-5 gap-2 items-end">
          <div className="col-span-2">
            <Label className="text-xs mb-0.5 block">HN *</Label>
            <Input
              value={props.hospitalNumber}
              onChange={(e) => props.onHospitalNumberChange(e.target.value)}
              className="h-6 text-xs"
              placeholder="HN"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-xs mb-0.5 block">ชื่อ *</Label>
            <Input
              value={props.firstName}
              onChange={(e) => props.onFirstNameChange(e.target.value)}
              className="h-6 text-xs"
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={props.onSearch}
            disabled={props.isSearching}
            className="h-6"
          >
            {props.isSearching ? <Loader2 className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs mb-0.5 block">สกุล *</Label>
            <Input
              value={props.lastName}
              onChange={(e) => props.onLastNameChange(e.target.value)}
              className="h-6 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs mb-0.5 block">ส่วนสูง (cm)</Label>
            <Input
              type="number"
              value={props.height}
              onChange={(e) => props.onHeightChange(e.target.value)}
              className="h-6 text-xs"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs">Alcohol</Label>
            <div className="flex gap-2">
              <div className="flex items-center space-x-1">
                <Checkbox
                  checked={props.alcohol === 'NO'}
                  onCheckedChange={(checked) => props.onAlcoholChange(checked ? 'NO' : '')}
                  id="alc-no"
                />
                <Label htmlFor="alc-no" className="text-xs">No</Label>
              </div>
              <div className="flex items-center space-x-1">
                <Checkbox
                  checked={props.alcohol === 'YES'}
                  onCheckedChange={(checked) => props.onAlcoholChange(checked ? 'YES' : '')}
                  id="alc-yes"
                />
                <Label htmlFor="alc-yes" className="text-xs">Yes</Label>
              </div>
            </div>
            <Input
              placeholder="เท่าไหร่"
              value={props.alcoholAmount}
              onChange={(e) => props.onAlcoholAmountChange(e.target.value)}
              className="h-6 text-xs flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs">Smoking</Label>
            <div className="flex gap-2">
              <div className="flex items-center space-x-1">
                <Checkbox
                  checked={props.smoking === 'NO'}
                  onCheckedChange={(checked) => props.onSmokingChange(checked ? 'NO' : '')}
                  id="smk-no"
                />
                <Label htmlFor="smk-no" className="text-xs">No</Label>
              </div>
              <div className="flex items-center space-x-1">
                <Checkbox
                  checked={props.smoking === 'YES'}
                  onCheckedChange={(checked) => props.onSmokingChange(checked ? 'YES' : '')}
                  id="smk-yes"
                />
                <Label htmlFor="smk-yes" className="text-xs">Yes</Label>
              </div>
            </div>
            <Input
              placeholder="เท่าไหร่"
              value={props.smokingAmount}
              onChange={(e) => props.onSmokingAmountChange(e.target.value)}
              className="h-6 text-xs flex-1"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}