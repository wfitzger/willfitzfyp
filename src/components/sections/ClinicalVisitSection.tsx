import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import InfoTooltip from "@/components/InfoTooltip";
import QuestionOption from "@/components/QuestionOption";

const ClinicalVisitSection = () => {
  const [encounter, setEncounter] = useState("");
  const [otherEncounter, setOtherEncounter] = useState("");
  const [clinicType, setClinicType] = useState("");
  const [seenBy, setSeenBy] = useState<string[]>([]);
  const [otherSeenBy, setOtherSeenBy] = useState("");

  const handleSeenByChange = (value: string, checked: boolean) => {
    if (checked) {
      setSeenBy([...seenBy, value]);
    } else {
      setSeenBy(seenBy.filter((v) => v !== value));
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <p className="text-sm text-foreground leading-relaxed mb-2">
            This section should be completed at every clinical encounter
            before any data is entered into the worksheet.
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>
              <strong>First visit/first interview:</strong> ask all questions
            </li>
            <li>
              <strong>Second or subsequent visit/interview:</strong> ask all
              questions
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Questions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            Clinical Encounter Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Question A - Encounter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium text-foreground">
                a. Encounter
              </Label>
              <InfoTooltip>
                <p>Select whether this is the participant's first or subsequent encounter with Precision MS. Patients must have been diagnosed within the last 3 years.</p>
              </InfoTooltip>
            </div>
            <RadioGroup
              value={encounter}
              onValueChange={setEncounter}
              className="pl-4 space-y-1"
            >
              <QuestionOption
                id="first-encounter"
                value="first"
                label="First P-MS encounter (limited to patients previously diagnosed at the location less than 3 years)"
                infoContent={
                  <p>First encounter data provides the participant's baseline.</p>
                }
              />
              <QuestionOption
                id="second-encounter"
                value="second"
                label="Second/subsequent P-MS encounter (limited to patients previously registered with Precision-MS)"
                infoContent={
                  <p>Subsequent encounters track disease progression over time.</p>
                }
              />
              <QuestionOption
                id="other-encounter"
                value="other"
                label="Other (please specify)"
                infoContent={
                  <p>Free text for encounter types not listed above.</p>
                }
                hasOtherInput
                isSelected={encounter === "other"}
                otherValue={otherEncounter}
                onOtherChange={setOtherEncounter}
              />
            </RadioGroup>
          </div>

          {/* Question B - Type of clinic */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-foreground">
              b. Type of clinic
            </Label>
            <RadioGroup
              value={clinicType}
              onValueChange={setClinicType}
              className="pl-4 space-y-1"
            >
              <QuestionOption
                id="virtual-clinic"
                value="virtual"
                label="Virtual clinic"
              />
              <QuestionOption
                id="in-person"
                value="in-person"
                label="In-person Appointment"
              />
            </RadioGroup>
          </div>

          {/* Question C - Seen by */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-foreground">
              c. Seen by (this visit)
            </Label>
            <div className="pl-4 space-y-2">
              <div className="flex items-center gap-3 py-2">
                <Checkbox
                  id="neurologist"
                  checked={seenBy.includes("neurologist")}
                  onCheckedChange={(checked) =>
                    handleSeenByChange("neurologist", checked as boolean)
                  }
                />
                <Label
                  htmlFor="neurologist"
                  className="text-sm font-normal cursor-pointer text-foreground"
                >
                  Neurologist/Medical
                </Label>
              </div>
              <div className="flex items-center gap-3 py-2">
                <Checkbox
                  id="nurse"
                  checked={seenBy.includes("nurse")}
                  onCheckedChange={(checked) =>
                    handleSeenByChange("nurse", checked as boolean)
                  }
                />
                <Label
                  htmlFor="nurse"
                  className="text-sm font-normal cursor-pointer text-foreground"
                >
                  MS Nurse Specialist/Nursing
                </Label>
              </div>
              <div className="flex items-center gap-3 py-2">
                <Checkbox
                  id="other-seen"
                  checked={seenBy.includes("other")}
                  onCheckedChange={(checked) =>
                    handleSeenByChange("other", checked as boolean)
                  }
                />
                <Label
                  htmlFor="other-seen"
                  className="text-sm font-normal cursor-pointer text-foreground"
                >
                  Other, please specify
                </Label>
                {seenBy.includes("other") && (
                  <Input
                    type="text"
                    placeholder="Please specify..."
                    value={otherSeenBy}
                    onChange={(e) => setOtherSeenBy(e.target.value)}
                    className="w-48 h-8 text-sm"
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicalVisitSection;
