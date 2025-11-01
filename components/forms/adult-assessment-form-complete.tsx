// components/forms/adult-assessment-form-complete.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Home } from 'lucide-react';

// Import all section components
import { DateRoundSection } from './sections/date-round-section';
import { PatientInfoSection } from './sections/patient-info-section';
import { PrimaryDiagnosisSection } from './sections/primary-diagnosis-section';
import { RiskFactorSection } from './sections/risk-factor-section';
import { AsthmaSection } from './sections/asthma-section';
import { COPDSection } from './sections/copd-section';
import { ARSection } from './sections/ar-section';
import { ComplianceSection } from './sections/compliance-section';
import { InhalerTechniqueSection } from './sections/inhaler-technique-section';
import { NonComplianceReasonsSection } from './sections/non-compliance-reasons-section';
import { DRPsSection } from './sections/drps-section';
import { SideEffectsSection } from './sections/side-effects-section';
import { MedicationsSection } from './sections/medications-section';

// Type definitions
interface FormData {
  assessmentDate: string;
  assessmentRound: 'PRE_COUNSELING' | 'POST_COUNSELING' | '';
  hospitalNumber: string;
  firstName: string;
  lastName: string;
  height: string;
  alcohol: 'YES' | 'NO' | '';
  alcoholAmount: string;
  smoking: 'YES' | 'NO' | '';
  smokingAmount: string;
  primaryDiagnosis: string;
  note: string;
  asthma: {
    pef: string;
    pefPercent: string;
    day: string;
    night: string;
    rescue: string;
    er: string;
    admit: string;
    controlLevel: string;
  };
  copd: {
    mMRC: string;
    cat: string;
    exacerbPerYear: string;
    fev1: string;
    sixMWD: string;
    stage: string;
  };
  ar: {
    symptoms: string;
    severity: 'MILD' | 'MOD_SEVERE' | '';
    pattern: 'INTERMITTENT' | 'PERSISTENT' | '';
  };
  compliance: {
    complianceStatus: 'GOOD_COMPLIANCE' | 'FIRST_USE' | 'CANNOT_ASSESS' | 'NON_COMPLIANCE' | '';
    cannotAssessReason: string;
    compliancePercent: string;
    nonComplianceReasons: {
      incorrectTechnique: boolean;
      incorrectDosage: boolean;
    };
  };
  technique: {
    techniqueCorrect: boolean;
    techniqueSteps: {
      prepare: { [device: string]: { checked: boolean; note: string } };
      inhale: { [device: string]: { checked: boolean; note: string } };
      rinse: { [device: string]: { checked: boolean; note: string } };
      empty: { [device: string]: { checked: boolean; note: string } };
    };
    spacerType: string;
  };
  nonComplianceReasons: {
    lessThan: boolean;
    lessThanDetail: string;
    moreThan: boolean;
    moreThanDetail: string;
    lackKnowledge: boolean;
    notReadLabel: boolean;
    elderly: boolean;
    forget: boolean;
    fearSideEffects: boolean;
    other: string;
  };
  drps: string;
  sideEffects: {
    hasSideEffects: boolean;
    oralCandidiasis: boolean;
    hoarseVoice: boolean;
    palpitation: boolean;
    other: string;
  };
  medications: {
    medicationStatus: 'NO_REMAINING' | 'HAS_REMAINING' | '';
    budesonide: string;
    seretide25_125: string;
    seretide50_250: string;
    seretideAccu: string;
    symbicort160: string;
    symbicort320: string;
    ventolinMDI: string;
    berodualMDI: string;
    avamysNS: string;
    theophylline: string;
    montelukast: string;
    spirivaHand: string;
    ellipta: string;
    spiolto: string;
    other: string;
  };
}

export function AdultAssessmentFormComplete() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [username, setUsername] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    assessmentDate: new Date().toISOString().split('T')[0],
    assessmentRound: '',
    hospitalNumber: '',
    firstName: '',
    lastName: '',
    height: '',
    alcohol: '',
    alcoholAmount: '',
    smoking: '',
    smokingAmount: '',
    primaryDiagnosis: '',
    note: '',
    asthma: {
      pef: '',
      pefPercent: '',
      day: '8',
      night: '0',
      rescue: '8',
      er: '0',
      admit: '0',
      controlLevel: '',
    },
    copd: {
      mMRC: '',
      cat: '',
      exacerbPerYear: '',
      fev1: '',
      sixMWD: '',
      stage: '',
    },
    ar: {
      symptoms: '',
      severity: '',
      pattern: '',
    },
    compliance: {
      complianceStatus: '',
      cannotAssessReason: '',
      compliancePercent: '',
      nonComplianceReasons: {
        incorrectTechnique: false,
        incorrectDosage: false,
      },
    },
    technique: {
      techniqueCorrect: false,
      techniqueSteps: {
        prepare: {},
        inhale: {},
        rinse: {},
        empty: {},
      },
      spacerType: '',
    },
    nonComplianceReasons: {
      lessThan: false,
      lessThanDetail: '',
      moreThan: false,
      moreThanDetail: '',
      lackKnowledge: false,
      notReadLabel: false,
      elderly: false,
      forget: false,
      fearSideEffects: false,
      other: '',
    },
    drps: '',
    sideEffects: {
      hasSideEffects: false,
      oralCandidiasis: false,
      hoarseVoice: false,
      palpitation: false,
      other: '',
    },
    medications: {
      medicationStatus: '',
      budesonide: '',
      seretide25_125: '',
      seretide50_250: '',
      seretideAccu: '',
      symbicort160: '',
      symbicort320: '',
      ventolinMDI: '',
      berodualMDI: '',
      avamysNS: '',
      theophylline: '',
      montelukast: '',
      spirivaHand: '',
      ellipta: '',
      spiolto: '',
      other: '',
    },
  });

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith('auth='));
    if (authCookie) {
      try {
        const authValue = decodeURIComponent(authCookie.split('=')[1]);
        const authData = JSON.parse(authValue);
        setUsername(authData.username || 'Unknown');
      } catch (error) {
        console.error('Failed to parse auth cookie:', error);
      }
    }
  }, []);

  const searchPatient = async () => {
    if (!formData.hospitalNumber.trim()) {
      toast.error('กรุณากรอก HN');
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/patients/search?hn=${formData.hospitalNumber}`);
      if (res.ok) {
        const patient = await res.json();
        setFormData(prev => ({
          ...prev,
          firstName: patient.firstName || '',
          lastName: patient.lastName || '',
          height: patient.height || '',
        }));
        toast.success('พบข้อมูลผู้ป่วย');
      } else {
        toast.info('ไม่พบข้อมูลผู้ป่วย จะสร้างข้อมูลใหม่');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hospitalNumber || !formData.firstName || !formData.lastName) {
      toast.error('กรุณากรอกข้อมูลที่จำเป็น: HN, ชื่อ, สกุล');
      return;
    }

    if (!formData.assessmentRound) {
      toast.error('กรุณาเลือกรอบการประเมิน');
      return;
    }

    if (!formData.primaryDiagnosis) {
      toast.error('กรุณาเลือกโรคหลัก');
      return;
    }

    setIsLoading(true);
    try {
      const apiData = {
        hospitalNumber: formData.hospitalNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        height: formData.height ? parseFloat(formData.height) : null,
        patientType: 'ADULT',
        assessmentRound: formData.assessmentRound,
        assessmentDate: formData.assessmentDate,
        alcohol: formData.alcohol === 'YES',
        alcoholAmount: formData.alcoholAmount || null,
        smoking: formData.smoking === 'YES',
        smokingAmount: formData.smokingAmount || null,
        primaryDiagnosis: formData.primaryDiagnosis,
        secondaryDiagnoses: [],
        note: formData.note || null,
        asthmaData: {
          pef: formData.asthma.pef || null,
          pefPercent: formData.asthma.pefPercent ? parseFloat(formData.asthma.pefPercent) : null,
          limitedActivity: {
            day: parseInt(formData.asthma.day) || 0,
            night: parseInt(formData.asthma.night) || 0,
            rescue: parseInt(formData.asthma.rescue) || 0,
            er: parseInt(formData.asthma.er) || 0,
            admit: parseInt(formData.asthma.admit) || 0,
          },
          controlLevel: formData.asthma.controlLevel || null,
        },
        copdData: {
          mMRC: formData.copd.mMRC ? parseInt(formData.copd.mMRC) : null,
          cat: formData.copd.cat ? parseInt(formData.copd.cat) : null,
          exacerbPerYear: formData.copd.exacerbPerYear ? parseInt(formData.copd.exacerbPerYear) : null,
          fev1: formData.copd.fev1 ? parseFloat(formData.copd.fev1) : null,
          sixMWD: formData.copd.sixMWD || null,
          stage: formData.copd.stage || null,
        },
        arData: {
          symptoms: formData.ar.symptoms || null,
          severity: formData.ar.severity || null,
          pattern: formData.ar.pattern || null,
        },
        complianceStatus: formData.compliance.complianceStatus,
        compliancePercent: parseInt(formData.compliance.compliancePercent) || 0,
        cannotAssessReason: formData.compliance.cannotAssessReason || null,
        nonComplianceReasons: [
          ...(formData.compliance.nonComplianceReasons.incorrectTechnique ? ['INCORRECT_TECHNIQUE'] : []),
          ...(formData.compliance.nonComplianceReasons.incorrectDosage ? ['INCORRECT_DOSAGE'] : []),
          ...(formData.nonComplianceReasons.lessThan ? ['LESS_THAN'] : []),
          ...(formData.nonComplianceReasons.moreThan ? ['MORE_THAN'] : []),
          ...(formData.nonComplianceReasons.lackKnowledge ? ['LACK_KNOWLEDGE'] : []),
          ...(formData.nonComplianceReasons.notReadLabel ? ['NOT_READ_LABEL'] : []),
          ...(formData.nonComplianceReasons.elderly ? ['ELDERLY'] : []),
          ...(formData.nonComplianceReasons.forget ? ['FORGET'] : []),
          ...(formData.nonComplianceReasons.fearSideEffects ? ['FEAR_SIDE_EFFECTS'] : []),
        ],
        nonComplianceOther: formData.nonComplianceReasons.other || null,
        hasSideEffects: formData.sideEffects.hasSideEffects,
        sideEffects: [
          ...(formData.sideEffects.oralCandidiasis ? ['ORAL_CANDIDIASIS'] : []),
          ...(formData.sideEffects.hoarseVoice ? ['HOARSE_VOICE'] : []),
          ...(formData.sideEffects.palpitation ? ['PALPITATION'] : []),
        ],
        sideEffectsOther: formData.sideEffects.other || null,
        sideEffectsManagement: null,
        drps: formData.drps || null,
        medicationStatus: formData.medications.medicationStatus,
        unopenedMedication: formData.medications.medicationStatus === 'HAS_REMAINING',
        techniqueCorrect: formData.technique.techniqueCorrect,
        inhalerDevices: Object.keys(formData.technique.techniqueSteps.prepare || {}).filter(
          device => Object.values(formData.technique.techniqueSteps).some(
            step => step[device]?.checked
          )
        ),
        techniqueSteps: formData.technique.techniqueSteps,
        spacerType: formData.technique.spacerType || null,
        medications: Object.entries(formData.medications)
          .filter(([key, value]) => key !== 'medicationStatus' && value && value.trim())
          .map(([key, value]) => ({
            code: key,
            name: key,
            quantity: parseInt(value) || 0,
          })),
      };

      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      if (res.ok) {
        toast.success('บันทึกข้อมูลสำเร็จ');
        router.push('/adult/success');
      } else {
        const error = await res.json();
        toast.error('เกิดข้อผิดพลาด', {
          description: error.error || 'ไม่สามารถบันทึกข้อมูลได้',
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('เกิดข้อผิดพลาด', {
        description: 'ไม่สามารถเชื่อมต่อกับระบบได้',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                แบบบันทึกการติดตามดูแลผู้ป่วย Asthma/COPD
              </h1>
              <p className="text-sm text-gray-600">ผู้บันทึก: {username}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
              disabled={isLoading}
              size="sm"
            >
              <Home className="w-4 h-4 mr-2" />
              กลับหน้าหลัก
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Form Content */}
      <form onSubmit={handleSubmit} className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-2">
            {/* 1. วันที่ */}
            <div className="col-span-2">
              <DateRoundSection
                assessmentDate={formData.assessmentDate}
                assessmentRound={formData.assessmentRound}
                onDateChange={(date) => setFormData(prev => ({ ...prev, assessmentDate: date }))}
                onRoundChange={(round) => setFormData(prev => ({ ...prev, assessmentRound: round }))}
              />
            </div>

            {/* 2. ข้อมูลผู้ป่วย */}
            <div className="col-span-2 col-start-3">
              <PatientInfoSection
                hospitalNumber={formData.hospitalNumber}
                firstName={formData.firstName}
                lastName={formData.lastName}
                height={formData.height}
                alcohol={formData.alcohol}
                alcoholAmount={formData.alcoholAmount}
                smoking={formData.smoking}
                smokingAmount={formData.smokingAmount}
                isSearching={isSearching}
                onHospitalNumberChange={(value) => setFormData(prev => ({ ...prev, hospitalNumber: value }))}
                onFirstNameChange={(value) => setFormData(prev => ({ ...prev, firstName: value }))}
                onLastNameChange={(value) => setFormData(prev => ({ ...prev, lastName: value }))}
                onHeightChange={(value) => setFormData(prev => ({ ...prev, height: value }))}
                onAlcoholChange={(value) => setFormData(prev => ({ ...prev, alcohol: value }))}
                onAlcoholAmountChange={(value) => setFormData(prev => ({ ...prev, alcoholAmount: value }))}
                onSmokingChange={(value) => setFormData(prev => ({ ...prev, smoking: value }))}
                onSmokingAmountChange={(value) => setFormData(prev => ({ ...prev, smokingAmount: value }))}
                onSearch={searchPatient}
              />
            </div>

            {/* 3. โรคหลัก */}
            <div className="col-span-2 row-start-2">
              <PrimaryDiagnosisSection
                primaryDiagnosis={formData.primaryDiagnosis}
                onDiagnosisChange={(value) => setFormData(prev => ({ ...prev, primaryDiagnosis: value }))}
              />
            </div>

            {/* 13. B. เหตุผลที่ไม่ใช้ยาตามที่กำหนด */}
            <div className="col-span-2 row-span-3 col-start-3 row-start-2">
              <NonComplianceReasonsSection
                reasons={formData.nonComplianceReasons}
                onReasonsChange={(data) => setFormData(prev => ({ 
                  ...prev, 
                  nonComplianceReasons: { ...prev.nonComplianceReasons, ...data } 
                }))}
              />
            </div>

            {/* 4. Note/Risk factor */}
            <div className="col-span-2 col-start-1 row-start-3">
              <RiskFactorSection
                note={formData.note}
                onNoteChange={(value) => setFormData(prev => ({ ...prev, note: value }))}
              />
            </div>

            {/* 5. Asthma */}
            <div className="row-span-2 col-start-1 row-start-4">
              <AsthmaSection
                asthma={formData.asthma}
                onAsthmaChange={(data) => setFormData(prev => ({ 
                  ...prev, 
                  asthma: { ...prev.asthma, ...data } 
                }))}
              />
            </div>

            {/* 6. COPD */}
            <div className="col-start-2 row-start-4">
              <COPDSection
                copd={formData.copd}
                onCOPDChange={(data) => setFormData(prev => ({ 
                  ...prev, 
                  copd: { ...prev.copd, ...data } 
                }))}
              />
            </div>

            {/* 7. AR */}
            <div className="col-start-2 row-start-5">
              <ARSection
                ar={formData.ar}
                onARChange={(data) => setFormData(prev => ({ 
                  ...prev, 
                  ar: { ...prev.ar, ...data } 
                }))}
              />
            </div>

            {/* 12. ผลข้างเคียงจากการใช้ยา */}
            <div className="col-span-2 col-start-3 row-start-5">
              <SideEffectsSection
                sideEffects={formData.sideEffects}
                onSideEffectsChange={(data) => setFormData(prev => ({ 
                  ...prev, 
                  sideEffects: { ...prev.sideEffects, ...data } 
                }))}
              />
            </div>

            {/* 8. การใช้ยา */}
            <div className="col-span-2 col-start-1 row-start-6">
              <ComplianceSection
                compliance={formData.compliance}
                onComplianceChange={(data) => setFormData(prev => ({ 
                  ...prev, 
                  compliance: { ...prev.compliance, ...data } 
                }))}
              />
            </div>

            {/* 11. DRPs */}
            <div className="col-span-2 col-start-3 row-start-6">
              <DRPsSection
                drps={formData.drps}
                onDRPsChange={(value) => setFormData(prev => ({ ...prev, drps: value }))}
              />
            </div>

            {/* 9. เทคนิคการพ่นยา */}
            <div className="col-span-2 row-span-2 col-start-1 row-start-7">
              <InhalerTechniqueSection
                technique={formData.technique}
                onTechniqueChange={(data) => setFormData(prev => ({ 
                  ...prev, 
                  technique: { ...prev.technique, ...data } 
                }))}
              />
            </div>

            {/* 10. ยาเหลือ */}
            <div className="col-span-2 row-span-2 col-start-3 row-start-7">
              <MedicationsSection
                medications={formData.medications}
                onMedicationsChange={(data) => setFormData(prev => ({ 
                  ...prev, 
                  medications: { ...prev.medications, ...data } 
                }))}
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="sticky bottom-0 bg-white border-t shadow-lg mt-6">
          <div className="container mx-auto px-4 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (confirm('คุณต้องการล้างข้อมูลทั้งหมดหรือไม่?')) {
                    window.location.reload();
                  }
                }}
                disabled={isLoading}
              >
                ล้างข้อมูล
              </Button>
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  'บันทึกข้อมูล'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}