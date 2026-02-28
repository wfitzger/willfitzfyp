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

const testStatusOptions: { value: TestStatus; label: string }[] = [
  { value: "result-available", label: "Yes, test performed and result available" },
  { value: "result-not-available", label: "Yes, test performed, but result not currently available" },
  { value: "not-requested", label: "No, test not requested" },
  { value: "unaware", label: "Participant unaware if test performed" },
  { value: "awaiting-referral", label: "Awaiting referral for test(s)" },
  { value: "referral-sent", label: "Referral(s) sent, awaiting appointment" },
  { value: "follow-up", label: "Data collector to follow up" },
  { value: "other", label: "Other, please specify" },
];

const TestStatusRadioGroup = ({
  value,
  onChange,
  dateValue,
  onDateChange,
  followUpValue,
  onFollowUpChange,
  otherValue,
  onOtherChange,
}: {
  value: TestStatus;
  onChange: (v: TestStatus) => void;
  dateValue: string;
  onDateChange: (v: string) => void;
  followUpValue: string;
  onFollowUpChange: (v: string) => void;
  otherValue: string;
  onOtherChange: (v: string) => void;
}) => (
  <RadioGroup value={value} onValueChange={(v) => onChange(v as TestStatus)} className="pl-4 space-y-2">
    {testStatusOptions.map((opt) => (
      <div key={opt.value}>
        <div className="flex items-center gap-3 py-1">
          <RadioGroupItem value={opt.value} id={`${opt.value}-${Math.random()}`} />
          <Label className="text-sm font-normal cursor-pointer">{opt.label}</Label>
        </div>
        {opt.value === "result-available" && value === "result-available" && (
          <div className="pl-8 pt-1">
            <Label className="text-xs text-muted-foreground">Date:</Label>
            <Input type="date" value={dateValue} onChange={(e) => onDateChange(e.target.value)} className="w-48 h-8 text-sm mt-1" />
          </div>
        )}
        {opt.value === "follow-up" && value === "follow-up" && (
          <div className="pl-8 pt-1">
            <Label className="text-xs text-muted-foreground">Reason for follow-up:</Label>
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
);

const ClinicalBadge = () => (
  <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs ml-2">Clinical</Badge>
);

const MSProgressionSection = () => {
  const [testsPerformed, setTestsPerformed] = useState("");
  const [testsPerformedDetail, setTestsPerformedDetail] = useState("");
  const [testsPerformedFollowUp, setTestsPerformedFollowUp] = useState("");
  const [testsPerformedOther, setTestsPerformedOther] = useState("");
  const [infoSourceYes, setInfoSourceYes] = useState("");
  const [infoSourceNo, setInfoSourceNo] = useState("");

  // MRI states
  const [mriBrain, setMriBrain] = useState<MRITestState>(emptyMRI());
  const [mriCSpine, setMriCSpine] = useState<MRITestState>(emptyMRI());
  const [mriTSpine, setMriTSpine] = useState<MRITestState>(emptyMRI());
  const [mriLSpine, setMriLSpine] = useState<MRITestState>(emptyMRI());

  // Biomarkers
  const [neurofilaments, setNeurofilaments] = useState<TestState>(emptyTest());
  const [biomarkersOther, setBiomarkersOther] = useState<ScoredTestState>(emptyScoredTest());

  // Monitoring tools
  const [t25fw, setT25fw] = useState<T25FWState>(emptyT25FW());
  const [edss, setEdss] = useState<ScoredTestState>(emptyScoredTest());
  const [sdmt, setSdmt] = useState<ScoredTestState>(emptyScoredTest());
  const [bdi, setBdi] = useState<ScoredTestState>(emptyScoredTest());
  const [hads, setHads] = useState<ScoredTestState>(emptyScoredTest());

  // Other tests
  const [otherTests, setOtherTests] = useState("");

  const updateMRI = (setter: React.Dispatch<React.SetStateAction<MRITestState>>, field: keyof MRITestState, value: string) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const updateScored = (setter: React.Dispatch<React.SetStateAction<ScoredTestState>>, field: keyof ScoredTestState, value: string) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const renderMRIBlock = (label: string, state: MRITestState, setter: React.Dispatch<React.SetStateAction<MRITestState>>) => (
    <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-4">
      <h4 className="text-sm font-medium text-foreground">MRI Type: {label}</h4>
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Was contrast administered?</Label>
        <RadioGroup value={state.contrast} onValueChange={(v) => updateMRI(setter, "contrast", v)} className="flex gap-4 pl-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id={`contrast-yes-${label}`} />
            <Label className="text-sm font-normal cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id={`contrast-no-${label}`} />
            <Label className="text-sm font-normal cursor-pointer">No</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="unknown" id={`contrast-unk-${label}`} />
            <Label className="text-sm font-normal cursor-pointer">Unknown</Label>
          </div>
        </RadioGroup>
      </div>
      <TestStatusRadioGroup
        value={state.status}
        onChange={(v) => updateMRI(setter, "status", v)}
        dateValue={state.date}
        onDateChange={(v) => updateMRI(setter, "date", v)}
        followUpValue={state.followUpReason}
        onFollowUpChange={(v) => updateMRI(setter, "followUpReason", v)}
        otherValue={state.otherSpecify}
        onOtherChange={(v) => updateMRI(setter, "otherSpecify", v)}
      />
    </div>
  );

  const renderScoredTest = (
    label: string,
    description: string,
    state: ScoredTestState,
    setter: React.Dispatch<React.SetStateAction<ScoredTestState>>,
    scoreLabel: string,
    isClinical: boolean,
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
      <TestStatusRadioGroup
        value={state.status}
        onChange={(v) => updateScored(setter, "status", v)}
        dateValue={state.date}
        onDateChange={(v) => updateScored(setter, "date", v)}
        followUpValue={state.followUpReason}
        onFollowUpChange={(v) => updateScored(setter, "followUpReason", v)}
        otherValue={state.otherSpecify}
        onOtherChange={(v) => updateScored(setter, "otherSpecify", v)}
      />
      {state.status === "result-available" && isClinical && (
        <div className="pl-4 space-y-3 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-destructive">Clinical data</span>
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

  const testsPerformedOptions = [
    { value: "yes-available", label: "Yes, test(s) performed, and result available" },
    { value: "yes-not-available", label: "Yes, but result(s) not currently available" },
    { value: "no-not-requested", label: "No, test(s) not requested" },
    { value: "unaware", label: "Participant unaware if test(s) performed" },
    { value: "awaiting-referral", label: "Awaiting referral for test(s)" },
    { value: "referral-sent", label: "Referral(s) sent, awaiting appointment" },
    { value: "follow-up", label: "Data collector to follow up" },
    { value: "other", label: "Other, please specify" },
  ];

  return (
    <div className="space-y-6">
      {/* Intro */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <p className="text-sm text-foreground leading-relaxed mb-2">
            MS Progression tests establish the rate of disease progression. This section should be completed from the <strong>second encounter onwards</strong>.
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li><strong>First visit:</strong> ask all questions</li>
            <li><strong>Second or subsequent visit:</strong> ask all questions — answers may change over time</li>
          </ul>
        </CardContent>
      </Card>

      {/* 6a. MS Progression Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            6a. MS Progression Tests
            <ClinicalBadge />
            <InfoTooltip>
              <p>Consider if tests were performed; researcher can follow up with medical record.</p>
            </InfoTooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Were tests performed? */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-foreground">
              For this encounter, were MS Progression Tests performed?
            </Label>
            <RadioGroup value={testsPerformed} onValueChange={setTestsPerformed} className="pl-4 space-y-2">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="yes" id="prog-yes" />
                <Label htmlFor="prog-yes" className="text-sm font-normal cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="no" id="prog-no" />
                <Label htmlFor="prog-no" className="text-sm font-normal cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>

          {testsPerformed === "yes" && (
            <div className="space-y-4 pl-4">
              <Label className="text-sm font-medium text-foreground">If Yes, MS Progression tests were performed for this encounter:</Label>
              <RadioGroup value={testsPerformedDetail} onValueChange={setTestsPerformedDetail} className="space-y-2">
                {testsPerformedOptions.map((opt) => (
                  <div key={opt.value}>
                    <div className="flex items-center gap-3 py-1">
                      <RadioGroupItem value={opt.value} id={`detail-${opt.value}`} />
                      <Label htmlFor={`detail-${opt.value}`} className="text-sm font-normal cursor-pointer">{opt.label}</Label>
                    </div>
                    {opt.value === "follow-up" && testsPerformedDetail === "follow-up" && (
                      <div className="pl-8 pt-1">
                        <Input value={testsPerformedFollowUp} onChange={(e) => setTestsPerformedFollowUp(e.target.value)} placeholder="Include reason for follow-up..." className="h-8 text-sm" />
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

          {/* Information source */}
          {testsPerformed === "yes" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">Information was obtained from:</Label>
              <RadioGroup value={infoSourceYes} onValueChange={setInfoSourceYes} className="flex gap-4 pl-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="participant" id="src-yes-participant" />
                  <Label className="text-sm font-normal cursor-pointer">Participant recall</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="record" id="src-yes-record" />
                  <Label className="text-sm font-normal cursor-pointer">Healthcare record</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="other" id="src-yes-other" />
                  <Label className="text-sm font-normal cursor-pointer">Other</Label>
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
                  <Label className="text-sm font-normal cursor-pointer">Participant recall</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="record" id="src-no-record" />
                  <Label className="text-sm font-normal cursor-pointer">Healthcare record</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="other" id="src-no-other" />
                  <Label className="text-sm font-normal cursor-pointer">Other</Label>
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
          {renderMRIBlock("Brain", mriBrain, setMriBrain)}
          {renderMRIBlock("C-Spine", mriCSpine, setMriCSpine)}
          {renderMRIBlock("T-Spine", mriTSpine, setMriTSpine)}
          {renderMRIBlock("L-Spine", mriLSpine, setMriLSpine)}
        </CardContent>
      </Card>

      {/* Biomarkers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">b. Biomarkers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Neurofilaments */}
          <div className="space-y-4">
            <Label className="text-base font-medium text-foreground">Neurofilaments</Label>
            <InfoTooltip><p>A protein found in neurons, used as a biomarker for nerve damage.</p></InfoTooltip>
            <TestStatusRadioGroup
              value={neurofilaments.status}
              onChange={(v) => setNeurofilaments((p) => ({ ...p, status: v }))}
              dateValue={neurofilaments.date}
              onDateChange={(v) => setNeurofilaments((p) => ({ ...p, date: v }))}
              followUpValue={neurofilaments.followUpReason}
              onFollowUpChange={(v) => setNeurofilaments((p) => ({ ...p, followUpReason: v }))}
              otherValue={neurofilaments.otherSpecify}
              onOtherChange={(v) => setNeurofilaments((p) => ({ ...p, otherSpecify: v }))}
            />
          </div>

          {/* Other Biomarkers - Clinical */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Label className="text-base font-medium text-foreground">Biomarkers: Other</Label>
              <ClinicalBadge />
            </div>
            <div className="space-y-3 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Date performed:</Label>
                <Input type="date" value={biomarkersOther.date} onChange={(e) => updateScored(setBiomarkersOther, "date", e.target.value)} className="w-48 h-8 text-sm" />
              </div>
              <RadioGroup value={biomarkersOther.status} onValueChange={(v) => updateScored(setBiomarkersOther, "status", v as TestStatus)} className="space-y-2">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="result-available" id="bio-other-yes" />
                  <Label className="text-sm font-normal cursor-pointer">Yes, test performed</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="not-requested" id="bio-other-no" />
                  <Label className="text-sm font-normal cursor-pointer">No, test not requested</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="follow-up" id="bio-other-fu" />
                  <Label className="text-sm font-normal cursor-pointer">Data collector to follow-up</Label>
                </div>
              </RadioGroup>
              {biomarkersOther.status === "follow-up" && (
                <Input value={biomarkersOther.followUpReason} onChange={(e) => updateScored(setBiomarkersOther, "followUpReason", e.target.value)} placeholder="Reason for follow-up..." className="h-8 text-sm" />
              )}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">If other, specify:</Label>
                <Input value={biomarkersOther.otherSpecify} onChange={(e) => updateScored(setBiomarkersOther, "otherSpecify", e.target.value)} placeholder="Specify biomarker..." className="h-8 text-sm" />
              </div>
            </div>
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
            <Label className="text-base font-medium text-foreground">Was Timed 25 Foot Walk (T25FW) Performed?</Label>
            <TestStatusRadioGroup
              value={t25fw.status}
              onChange={(v) => setT25fw((p) => ({ ...p, status: v }))}
              dateValue={t25fw.date}
              onDateChange={(v) => setT25fw((p) => ({ ...p, date: v }))}
              followUpValue={t25fw.followUpReason}
              onFollowUpChange={(v) => setT25fw((p) => ({ ...p, followUpReason: v }))}
              otherValue={t25fw.otherSpecify}
              onOtherChange={(v) => setT25fw((p) => ({ ...p, otherSpecify: v }))}
            />
            {t25fw.status === "result-available" && (
              <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20 space-y-3">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-destructive">Clinical data</span>
                  <ClinicalBadge />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">T25FW Score – Time 1</Label>
                    <Input value={t25fw.scoreTime1} onChange={(e) => setT25fw((p) => ({ ...p, scoreTime1: e.target.value }))} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Performed by (discipline)</Label>
                    <Input value={t25fw.performedBy1} onChange={(e) => setT25fw((p) => ({ ...p, performedBy1: e.target.value }))} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">T25FW Score – Time 2</Label>
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
            "Expanded Disability Status Scale — measures disability on a scale of 0.0 to 10.0.",
            edss,
            setEdss,
            "EDSS Score (0.0–10.0)",
            true,
          )}

          {/* SDMT */}
          {renderScoredTest(
            "Was SDMT performed?",
            "Symbol Digit Modalities Test — measures processing speed.",
            sdmt,
            setSdmt,
            "SDMT Score (no. of correct symbols)",
            true,
          )}

          {/* BDI */}
          {renderScoredTest(
            "Was BDI performed?",
            "Beck's Depression Inventory — measures depression severity.",
            bdi,
            setBdi,
            "BDI Score",
            true,
          )}

          {/* HADS */}
          {renderScoredTest(
            "Was HADS performed?",
            "Hospital Anxiety and Depression Scale — also appears in the Mood section.",
            hads,
            setHads,
            "HADS Total Score",
            true,
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
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Include date, score, type of test, and performed by.</p>
          <Textarea
            value={otherTests}
            onChange={(e) => setOtherTests(e.target.value)}
            placeholder="Enter details of any other tests performed..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MSProgressionSection;
