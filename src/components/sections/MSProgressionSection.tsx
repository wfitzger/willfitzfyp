import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import InfoTooltip from "@/components/InfoTooltip";

type TestStatus =
  | ""
  | "result-available"
  | "result-not-available"
  | "not-requested"
  | "unaware"
  | "awaiting-referral"
  | "referral-sent"
  | "follow-up"
  | "other";

interface TestState {
  status: TestStatus;
  date: string;
  followUpReason: string;
  otherSpecify: string;
}

interface MRITestState extends TestState {
  contrast: string;
}

interface ScoredTestState extends TestState {
  score: string;
  performedBy: string;
}

interface T25FWState extends TestState {
  scoreTime1: string;
  scoreTime2: string;
  performedBy1: string;
  performedBy2: string;
}

const emptyTest = (): TestState => ({
  status: "",
  date: "",
  followUpReason: "",
  otherSpecify: "",
});

const emptyMRI = (): MRITestState => ({ ...emptyTest(), contrast: "" });
const emptyScoredTest = (): ScoredTestState => ({ ...emptyTest(), score: "", performedBy: "" });
const emptyT25FW = (): T25FWState => ({ ...emptyTest(), scoreTime1: "", scoreTime2: "", performedBy1: "", performedBy2: "" });

const yesStatusOptions: { value: TestStatus; label: string }[] = [
  { value: "result-available", label: "Yes, test performed and result available" },
  { value: "result-not-available", label: "Yes, test performed, but result not currently available" },
];

const noStatusOptions: { value: TestStatus; label: string }[] = [
  { value: "not-requested", label: "No, test not requested" },
  { value: "unaware", label: "Participant unaware if test performed" },
  { value: "awaiting-referral", label: "Awaiting referral for test(s)" },
  { value: "referral-sent", label: "Referral(s) sent, awaiting appointment" },
  { value: "follow-up", label: "Data collector to follow up" },
  { value: "other", label: "Other, please specify" },
];

const ConditionalTestStatus = ({
  testPerformed,
  onTestPerformedChange,
  value,
  onChange,
  dateValue,
  onDateChange,
  followUpValue,
  onFollowUpChange,
  otherValue,
  onOtherChange,
  idPrefix,
}: {
  testPerformed: string;
  onTestPerformedChange: (v: string) => void;
  value: TestStatus;
  onChange: (v: TestStatus) => void;
  dateValue: string;
  onDateChange: (v: string) => void;
  followUpValue: string;
  onFollowUpChange: (v: string) => void;
  otherValue: string;
  onOtherChange: (v: string) => void;
  idPrefix: string;
}) => {
  const options = testPerformed === "yes" ? yesStatusOptions : testPerformed === "no" ? noStatusOptions : [];

  return (
    <div className="space-y-3">
      <RadioGroup value={testPerformed} onValueChange={(v) => { onTestPerformedChange(v); onChange("" as TestStatus); }} className="flex gap-4 pl-4">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="yes" id={`${idPrefix}-tp-yes`} />
          <Label htmlFor={`${idPrefix}-tp-yes`} className="text-sm font-normal cursor-pointer select-none">Yes</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="no" id={`${idPrefix}-tp-no`} />
          <Label htmlFor={`${idPrefix}-tp-no`} className="text-sm font-normal cursor-pointer select-none">No</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="unknown" id={`${idPrefix}-tp-unk`} />
          <Label htmlFor={`${idPrefix}-tp-unk`} className="text-sm font-normal cursor-pointer select-none">Unknown</Label>
        </div>
      </RadioGroup>

      {options.length > 0 && (
        <RadioGroup value={value} onValueChange={(v) => onChange(v as TestStatus)} className="pl-8 space-y-2">
          {options.map((opt) => (
            <div key={opt.value}>
              <div className="flex items-center gap-3 py-1">
                <RadioGroupItem value={opt.value} id={`${idPrefix}-${opt.value}`} />
                <Label htmlFor={`${idPrefix}-${opt.value}`} className="text-sm font-normal cursor-pointer select-none">{opt.label}</Label>
              </div>
              {opt.value === "result-available" && value === "result-available" && (
                <div className="pl-8 pt-1">
                  <Label className="text-xs text-muted-foreground">Date:</Label>
                  <Input type="date" value={dateValue} onChange={(e) => onDateChange(e.target.value)} className="w-48 h-8 text-sm mt-1" />
                </div>
              )}
              {opt.value === "follow-up" && value === "follow-up" && (
                <div className="pl-8 pt-1">
                  <Label className="text-xs text-muted-foreground">Reason for follow up:</Label>
                  <Input value={followUpValue} onChange={(e) => onFollowUpChange(e.target.value)} placeholder="Include reason..." className="w-full h-8 text-sm mt-1" />
                </div>
              )}
              {opt.value === "other" && value === "other" && (
                <div className="pl-8 pt-1">
                  <Input value={otherValue} onChange={(e) => onOtherChange(e.target.value)} placeholder="Please specify..." className="w-full h-8 text-sm mt-1" />
                </div>
              )}
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

const ClinicalBadge = () => (
  <Badge className="bg-red-600 text-white border-red-700 text-xs ml-2 font-semibold shadow-sm">Clinical</Badge>
);

const MSProgressionSection = () => {
  const [isSubsequentVisit, setIsSubsequentVisit] = useState("");

  const [testsPerformed, setTestsPerformed] = useState("");
  const [testsPerformedDetail, setTestsPerformedDetail] = useState("");
  const [testsPerformedFollowUp, setTestsPerformedFollowUp] = useState("");
  const [testsPerformedOther, setTestsPerformedOther] = useState("");
  const [infoSourceYes, setInfoSourceYes] = useState("");
  const [infoSourceNo, setInfoSourceNo] = useState("");

  const [mriBrain, setMriBrain] = useState<MRITestState>(emptyMRI());
  const [mriCSpine, setMriCSpine] = useState<MRITestState>(emptyMRI());
  const [mriTSpine, setMriTSpine] = useState<MRITestState>(emptyMRI());
  const [mriLSpine, setMriLSpine] = useState<MRITestState>(emptyMRI());
  const [mriBrainPerformed, setMriBrainPerformed] = useState("");
  const [mriCSpinePerformed, setMriCSpinePerformed] = useState("");
  const [mriTSpinePerformed, setMriTSpinePerformed] = useState("");
  const [mriLSpinePerformed, setMriLSpinePerformed] = useState("");

  const [neurofilaments, setNeurofilaments] = useState<TestState>(emptyTest());
  const [neuroPerformed, setNeuroPerformed] = useState("");
  const [bioOtherPerformed, setBioOtherPerformed] = useState("");
  const [biomarkersOther, setBiomarkersOther] = useState<ScoredTestState>(emptyScoredTest());

  const [t25fw, setT25fw] = useState<T25FWState>(emptyT25FW());
  const [t25fwPerformed, setT25fwPerformed] = useState("");
  const [edss, setEdss] = useState<ScoredTestState>(emptyScoredTest());
  const [edssPerformed, setEdssPerformed] = useState("");
  const [sdmt, setSdmt] = useState<ScoredTestState>(emptyScoredTest());
  const [sdmtPerformed, setSdmtPerformed] = useState("");
  const [bdi, setBdi] = useState<ScoredTestState>(emptyScoredTest());
  const [bdiPerformed, setBdiPerformed] = useState("");
  const [hads, setHads] = useState<ScoredTestState>(emptyScoredTest());
  const [hadsPerformed, setHadsPerformed] = useState("");

  const [otherTestPerformed, setOtherTestPerformed] = useState("");
  const [otherTestDate, setOtherTestDate] = useState("");
  const [otherTestType, setOtherTestType] = useState("");
  const [otherTestScore, setOtherTestScore] = useState("");
  const [otherTestPerformedBy, setOtherTestPerformedBy] = useState("");
  const [otherTestFollowUpReason, setOtherTestFollowUpReason] = useState("");

  const updateMRI = (setter: React.Dispatch<React.SetStateAction<MRITestState>>, field: keyof MRITestState, value: string) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const updateScored = (setter: React.Dispatch<React.SetStateAction<ScoredTestState>>, field: keyof ScoredTestState, value: string) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const renderMRIBlock = (
    label: string,
    state: MRITestState,
    setter: React.Dispatch<React.SetStateAction<MRITestState>>,
    performed: string,
    setPerformed: (v: string) => void,
    idPrefix: string,
    infoContent?: React.ReactNode,
  ) => (
    <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-4">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium text-foreground">MRI Type: {label}</h4>
        {infoContent && <InfoTooltip>{infoContent}</InfoTooltip>}
      </div>
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Was contrast administered?</Label>
        <RadioGroup value={state.contrast} onValueChange={(v) => updateMRI(setter, "contrast", v)} className="flex gap-4 pl-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id={`contrast-yes-${idPrefix}`} />
            <Label htmlFor={`contrast-yes-${idPrefix}`} className="text-sm font-normal cursor-pointer select-none">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id={`contrast-no-${idPrefix}`} />
            <Label htmlFor={`contrast-no-${idPrefix}`} className="text-sm font-normal cursor-pointer select-none">No</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="unknown" id={`contrast-unk-${idPrefix}`} />
            <Label htmlFor={`contrast-unk-${idPrefix}`} className="text-sm font-normal cursor-pointer select-none">Unknown</Label>
          </div>
        </RadioGroup>
      </div>
      <Label className="text-sm text-muted-foreground">Was the test performed?</Label>
      <ConditionalTestStatus
        testPerformed={performed}
        onTestPerformedChange={setPerformed}
        value={state.status}
        onChange={(v) => updateMRI(setter, "status", v)}
        dateValue={state.date}
        onDateChange={(v) => updateMRI(setter, "date", v)}
        followUpValue={state.followUpReason}
        onFollowUpChange={(v) => updateMRI(setter, "followUpReason", v)}
        otherValue={state.otherSpecify}
        onOtherChange={(v) => updateMRI(setter, "otherSpecify", v)}
        idPrefix={idPrefix}
      />
    </div>
  );

  const renderScoredTest = (
    label: string,
    description: string,
    state: ScoredTestState,
    setter: React.Dispatch<React.SetStateAction<ScoredTestState>>,
    performed: string,
    setPerformed: (v: string) => void,
    scoreLabel: string,
    isClinical: boolean,
    idPrefix: string,
    extra?: React.ReactNode,
  ) => (
    <div className="space-y-4">
      <div className="flex items-center">
        <Label className="text-base font-medium text-foreground">{label}</Label>
        {isClinical && <ClinicalBadge />}
        {description && (
          <InfoTooltip>
            <p>{description}</p>
          </InfoTooltip>
        )}
      </div>
      {extra}
      <ConditionalTestStatus
        testPerformed={performed}
        onTestPerformedChange={setPerformed}
        value={state.status}
        onChange={(v) => updateScored(setter, "status", v)}
        dateValue={state.date}
        onDateChange={(v) => updateScored(setter, "date", v)}
        followUpValue={state.followUpReason}
        onFollowUpChange={(v) => updateScored(setter, "followUpReason", v)}
        otherValue={state.otherSpecify}
        onOtherChange={(v) => updateScored(setter, "otherSpecify", v)}
        idPrefix={idPrefix}
      />
      {state.status === "result-available" && isClinical && (
        <div className="pl-4 space-y-3 p-3 bg-red-50 rounded-lg border-2 border-red-300">
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-red-700">Clinical data</span>
            <ClinicalBadge />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">{scoreLabel}</Label>
              <Input value={state.score} onChange={(e) => updateScored(setter, "score", e.target.value)} placeholder="Enter score" className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Performed by (discipline)</Label>
              <Input value={state.performedBy} onChange={(e) => updateScored(setter, "performedBy", e.target.value)} placeholder="e.g. Neurologist" className="h-8 text-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const testsPerformedYesOptions = [
    { value: "yes-available", label: "Yes, test(s) performed, and result available" },
    { value: "yes-not-available", label: "Yes, but result(s) not currently available" },
  ];

  const testsPerformedNoOptions = [
    { value: "no-not-requested", label: "No, test(s) not requested" },
    { value: "unaware", label: "Participant unaware if test(s) performed" },
    { value: "awaiting-referral", label: "Awaiting referral for test(s)" },
    { value: "referral-sent", label: "Referral(s) sent, awaiting appointment" },
    { value: "follow-up", label: "Data collector to follow up" },
    { value: "other", label: "Other, please specify" },
  ];

  const detailOptions = testsPerformed === "yes" ? testsPerformedYesOptions : testsPerformed === "no" ? testsPerformedNoOptions : [];

  return (
    <div className="space-y-6">
      {/* Info card */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2 mb-3">
            <p className="text-sm text-foreground leading-relaxed">
              This section does not need to be filled on the first encounter.
            </p>
            <InfoTooltip>
              <p>Complete from the second encounter onwards. If not completed at that time, review and complete as soon as possible. If applicable, also complete MS Diagnostic Tests for the initial encounter.</p>
            </InfoTooltip>
          </div>
        </CardContent>
      </Card>

      {/* Gate question: is this a second or subsequent visit? */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Label className="text-base font-medium text-foreground">
            Is this the second or subsequent visit for this participant?
          </Label>
          <RadioGroup value={isSubsequentVisit} onValueChange={setIsSubsequentVisit} className="flex gap-4 pl-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="subsequent-yes" />
              <Label htmlFor="subsequent-yes" className="text-sm font-normal cursor-pointer select-none">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="subsequent-no" />
              <Label htmlFor="subsequent-no" className="text-sm font-normal cursor-pointer select-none">No</Label>
            </div>
          </RadioGroup>

          {isSubsequentVisit === "no" && (
            <p className="text-sm text-muted-foreground italic pl-4">
              This section is for second and subsequent encounters only. No further questions are required for the first visit.
            </p>
          )}
        </CardContent>
      </Card>

      {isSubsequentVisit === "yes" && (
        <>
          {/* MS Progression Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground flex items-center">
                For this encounter, were MS Progression Tests performed?
                <InfoTooltip>
                  <p>Consider if tests were performed. A researcher can follow up with the medical record.</p>
                </InfoTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <RadioGroup value={testsPerformed} onValueChange={(v) => { setTestsPerformed(v); setTestsPerformedDetail(""); }} className="pl-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="yes" id="prog-yes" />
                    <Label htmlFor="prog-yes" className="text-sm font-normal cursor-pointer select-none">Yes</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="no" id="prog-no" />
                    <Label htmlFor="prog-no" className="text-sm font-normal cursor-pointer select-none">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {detailOptions.length > 0 && (
                <div className="space-y-4 pl-4">
                  <Label className="text-sm font-medium text-foreground">
                    {testsPerformed === "yes" ? "MS Progression tests were performed for this encounter:" : "Details:"}
                  </Label>
                  <RadioGroup value={testsPerformedDetail} onValueChange={setTestsPerformedDetail} className="space-y-2">
                    {detailOptions.map((opt) => (
                      <div key={opt.value}>
                        <div className="flex items-center gap-3 py-1">
                          <RadioGroupItem value={opt.value} id={`detail-${opt.value}`} />
                          <Label htmlFor={`detail-${opt.value}`} className="text-sm font-normal cursor-pointer select-none">{opt.label}</Label>
                        </div>
                        {opt.value === "follow-up" && testsPerformedDetail === "follow-up" && (
                          <div className="pl-8 pt-1">
                            <Input value={testsPerformedFollowUp} onChange={(e) => setTestsPerformedFollowUp(e.target.value)} placeholder="Include reason for follow up..." className="h-8 text-sm" />
                          </div>
                        )}
                        {opt.value === "other" && testsPerformedDetail === "other" && (
                          <div className="pl-8 pt-1">
                            <Input value={testsPerformedOther} onChange={(e) => setTestsPerformedOther(e.target.value)} placeholder="Please specify..." className="h-8 text-sm" />
                          </div>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {testsPerformed === "yes" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Information was obtained from:</Label>
                  <RadioGroup value={infoSourceYes} onValueChange={setInfoSourceYes} className="flex gap-4 pl-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="participant" id="src-yes-participant" />
                      <Label htmlFor="src-yes-participant" className="text-sm font-normal cursor-pointer select-none">Participant recall</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="record" id="src-yes-record" />
                      <Label htmlFor="src-yes-record" className="text-sm font-normal cursor-pointer select-none">Healthcare record</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="other" id="src-yes-other" />
                      <Label htmlFor="src-yes-other" className="text-sm font-normal cursor-pointer select-none">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {testsPerformed === "no" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">Information was obtained from:</Label>
                  <RadioGroup value={infoSourceNo} onValueChange={setInfoSourceNo} className="flex gap-4 pl-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="participant" id="src-no-participant" />
                      <Label htmlFor="src-no-participant" className="text-sm font-normal cursor-pointer select-none">Participant recall</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="record" id="src-no-record" />
                      <Label htmlFor="src-no-record" className="text-sm font-normal cursor-pointer select-none">Healthcare record</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="other" id="src-no-other" />
                      <Label htmlFor="src-no-other" className="text-sm font-normal cursor-pointer select-none">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </CardContent>
          </Card>

          {/* MRI Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">a. MRI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderMRIBlock("Brain", mriBrain, setMriBrain, mriBrainPerformed, setMriBrainPerformed, "mri-brain")}
              {renderMRIBlock("C-Spine", mriCSpine, setMriCSpine, mriCSpinePerformed, setMriCSpinePerformed, "mri-cspine",
                <p>Cervical Spine (neck region). MRI of the C-Spine checks for lesions in the upper spinal cord.</p>
              )}
              {renderMRIBlock("T-Spine", mriTSpine, setMriTSpine, mriTSpinePerformed, setMriTSpinePerformed, "mri-tspine",
                <p>Thoracic Spine (mid-back region). MRI of the T-Spine checks for lesions in the mid spinal cord.</p>
              )}
              {renderMRIBlock("L-Spine", mriLSpine, setMriLSpine, mriLSpinePerformed, setMriLSpinePerformed, "mri-lspine",
                <p>Lumbar Spine (lower back region). MRI of the L-Spine checks for lesions in the lower spinal cord.</p>
              )}
            </CardContent>
          </Card>

          {/* Biomarkers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
                b. Biomarkers
                <InfoTooltip>
                  <p>Biomarkers are measurable indicators (e.g. proteins in blood or spinal fluid) used to detect nerve damage or disease activity.</p>
                </InfoTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Neurofilaments */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium text-foreground">Were Neurofilament tests performed?</Label>
                  <InfoTooltip><p>Neurofilaments are proteins found in neurons. Elevated levels indicate nerve damage.</p></InfoTooltip>
                </div>
                <ConditionalTestStatus
                  testPerformed={neuroPerformed}
                  onTestPerformedChange={setNeuroPerformed}
                  value={neurofilaments.status}
                  onChange={(v) => setNeurofilaments((p) => ({ ...p, status: v }))}
                  dateValue={neurofilaments.date}
                  onDateChange={(v) => setNeurofilaments((p) => ({ ...p, date: v }))}
                  followUpValue={neurofilaments.followUpReason}
                  onFollowUpChange={(v) => setNeurofilaments((p) => ({ ...p, followUpReason: v }))}
                  otherValue={neurofilaments.otherSpecify}
                  onOtherChange={(v) => setNeurofilaments((p) => ({ ...p, otherSpecify: v }))}
                  idPrefix="neuro"
                />
              </div>

              {/* Other Biomarkers - Clinical */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Label className="text-base font-medium text-foreground">Were other biomarker tests performed?</Label>
                  <ClinicalBadge />
                </div>
                <RadioGroup value={bioOtherPerformed} onValueChange={(v) => { setBioOtherPerformed(v); setBiomarkersOther(emptyScoredTest()); }} className="flex gap-4 pl-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id="bio-other-tp-yes" />
                    <Label htmlFor="bio-other-tp-yes" className="text-sm font-normal cursor-pointer select-none">Yes</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="bio-other-tp-no" />
                    <Label htmlFor="bio-other-tp-no" className="text-sm font-normal cursor-pointer select-none">No</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="unknown" id="bio-other-tp-unk" />
                    <Label htmlFor="bio-other-tp-unk" className="text-sm font-normal cursor-pointer select-none">Unknown</Label>
                  </div>
                </RadioGroup>

                {bioOtherPerformed === "yes" && (
                  <div className="space-y-4 p-4 bg-red-50 rounded-lg border-2 border-red-300">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-red-700">Clinical data</span>
                      <ClinicalBadge />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Specify biomarker:</Label>
                      <Input value={biomarkersOther.otherSpecify} onChange={(e) => updateScored(setBiomarkersOther, "otherSpecify", e.target.value)} placeholder="Specify biomarker..." className="h-8 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Date performed:</Label>
                      <Input type="date" value={biomarkersOther.date} onChange={(e) => updateScored(setBiomarkersOther, "date", e.target.value)} className="w-48 h-8 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Results:</Label>
                      <Textarea value={biomarkersOther.score} onChange={(e) => updateScored(setBiomarkersOther, "score", e.target.value)} placeholder="Enter test results..." className="min-h-[80px] text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Performed by (discipline):</Label>
                      <Input value={biomarkersOther.performedBy} onChange={(e) => updateScored(setBiomarkersOther, "performedBy", e.target.value)} placeholder="e.g. Neurologist" className="h-8 text-sm" />
                    </div>
                  </div>
                )}

                {bioOtherPerformed === "no" && (
                  <RadioGroup value={biomarkersOther.status} onValueChange={(v) => updateScored(setBiomarkersOther, "status", v)} className="pl-8 space-y-2">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="not-requested" id="bio-other-nr" />
                      <Label htmlFor="bio-other-nr" className="text-sm font-normal cursor-pointer select-none">No, test not requested</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="follow-up" id="bio-other-fu" />
                      <Label htmlFor="bio-other-fu" className="text-sm font-normal cursor-pointer select-none">Data collector to follow up</Label>
                    </div>
                    {biomarkersOther.status === "follow-up" && (
                      <div className="pl-8">
                        <Input value={biomarkersOther.followUpReason} onChange={(e) => updateScored(setBiomarkersOther, "followUpReason", e.target.value)} placeholder="Reason for follow up..." className="h-8 text-sm" />
                      </div>
                    )}
                  </RadioGroup>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">c. Monitoring Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-10">
              {/* T25FW */}
              <div className="space-y-4">
                <Label className="text-base font-medium text-foreground">Was Timed 25 Foot Walk (T25FW) performed?</Label>
                <ConditionalTestStatus
                  testPerformed={t25fwPerformed}
                  onTestPerformedChange={setT25fwPerformed}
                  value={t25fw.status}
                  onChange={(v) => setT25fw((p) => ({ ...p, status: v }))}
                  dateValue={t25fw.date}
                  onDateChange={(v) => setT25fw((p) => ({ ...p, date: v }))}
                  followUpValue={t25fw.followUpReason}
                  onFollowUpChange={(v) => setT25fw((p) => ({ ...p, followUpReason: v }))}
                  otherValue={t25fw.otherSpecify}
                  onOtherChange={(v) => setT25fw((p) => ({ ...p, otherSpecify: v }))}
                  idPrefix="t25fw"
                />
                {t25fw.status === "result-available" && (
                  <div className="p-3 bg-red-50 rounded-lg border-2 border-red-300 space-y-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-red-700">Clinical data</span>
                      <ClinicalBadge />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">T25FW Score - Time 1</Label>
                        <Input value={t25fw.scoreTime1} onChange={(e) => setT25fw((p) => ({ ...p, scoreTime1: e.target.value }))} className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Performed by (discipline)</Label>
                        <Input value={t25fw.performedBy1} onChange={(e) => setT25fw((p) => ({ ...p, performedBy1: e.target.value }))} className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">T25FW Score - Time 2</Label>
                        <Input value={t25fw.scoreTime2} onChange={(e) => setT25fw((p) => ({ ...p, scoreTime2: e.target.value }))} className="h-8 text-sm" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Performed by (discipline)</Label>
                        <Input value={t25fw.performedBy2} onChange={(e) => setT25fw((p) => ({ ...p, performedBy2: e.target.value }))} className="h-8 text-sm" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* EDSS */}
              {renderScoredTest(
                "Was EDSS performed?",
                "Expanded Disability Status Scale. Measures disability on a scale of 0.0 to 10.0.",
                edss, setEdss, edssPerformed, setEdssPerformed,
                "EDSS Score (0.0 to 10.0)", true, "edss",
              )}

              {/* SDMT */}
              {renderScoredTest(
                "Was SDMT performed?",
                "Symbol Digit Modalities Test. Measures processing speed.",
                sdmt, setSdmt, sdmtPerformed, setSdmtPerformed,
                "SDMT Score (no. of correct symbols)", true, "sdmt",
              )}

              {/* BDI */}
              {renderScoredTest(
                "Was BDI performed?",
                "Beck's Depression Inventory. Measures depression severity.",
                bdi, setBdi, bdiPerformed, setBdiPerformed,
                "BDI Score", true, "bdi",
              )}

              {/* HADS */}
              {renderScoredTest(
                "Was HADS performed?",
                "Hospital Anxiety and Depression Scale. Also appears in the Mood section.",
                hads, setHads, hadsPerformed, setHadsPerformed,
                "HADS Total Score", true, "hads",
              )}
            </CardContent>
          </Card>

          {/* d. Other tests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground flex items-center">
                d. Other Tests Performed
                <ClinicalBadge />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label className="text-base font-medium text-foreground">Were other tests performed?</Label>
              <RadioGroup value={otherTestPerformed} onValueChange={setOtherTestPerformed} className="flex gap-4 pl-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="other-test-yes" />
                  <Label htmlFor="other-test-yes" className="text-sm font-normal cursor-pointer select-none">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="other-test-no" />
                  <Label htmlFor="other-test-no" className="text-sm font-normal cursor-pointer select-none">No</Label>
                </div>
              </RadioGroup>

              {otherTestPerformed === "yes" && (
                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300 space-y-4">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-red-700">Clinical data</span>
                    <ClinicalBadge />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Type of test</Label>
                      <Input value={otherTestType} onChange={(e) => setOtherTestType(e.target.value)} placeholder="Enter test type..." className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Date performed</Label>
                      <Input type="date" value={otherTestDate} onChange={(e) => setOtherTestDate(e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Score</Label>
                      <Input value={otherTestScore} onChange={(e) => setOtherTestScore(e.target.value)} placeholder="Enter score..." className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Performed by (discipline)</Label>
                      <Input value={otherTestPerformedBy} onChange={(e) => setOtherTestPerformedBy(e.target.value)} placeholder="e.g. Neurologist" className="h-8 text-sm" />
                    </div>
                  </div>
                </div>
              )}

              {otherTestPerformed === "no" && (
                <p className="text-sm text-muted-foreground italic pl-4">No other tests performed for this encounter.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default MSProgressionSection;
