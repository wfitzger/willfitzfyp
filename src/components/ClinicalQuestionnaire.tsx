import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InfoTooltip from "./InfoTooltip";
import QuestionOption from "./QuestionOption";
import FamilyMSHistorySection from "./FamilyMSHistorySection";
import ChatbotPopup from "./ChatbotPopup";

const ClinicalQuestionnaire = () => {
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
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Section 2 */}
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                Section 2: Clinical Visit Information
              </h1>
              <InfoTooltip>
                <p className="mb-3">
                  Data is collected around a clinical encounter. An encounter is
                  any interaction between a patient and a healthcare provider
                  that involves delivering healthcare services/generating data.
                  These encounters can vary in purpose, setting, and duration,
                  but they all aim to address a patient's health need and
                  generate data.
                </p>
                <p>
                  <strong>Note:</strong> We need to consider the length of an
                  encounter, i.e., if the patient sees Team and is referred for
                  and then has an MRI, is this one or two encounters? This is
                  important as it will alert the data collector to initiate a
                  new data collection session.
                </p>
              </InfoTooltip>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              All non-clinical questions
            </p>
          </div>

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
                    <p className="mb-3">
                      Data collection is limited to patients previously diagnosed
                      at the location less than 3 years. By clicking any option in
                      this section, you are confirming the patient has been
                      diagnosed less than 3 years ago.
                    </p>
                    <p>
                      We also want to know whether this encounter is their first
                      one with a Precision MS researcher or their
                      second/subsequent one.
                    </p>
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
                      <p>
                        If First P-MS encounter option is clicked, it means data
                        collected related to the participants' first encounter
                        with Precision MS research. It is important to know that
                        data collected in the first encounter will provide a
                        baseline for participants.
                      </p>
                    }
                  />
                  <QuestionOption
                    id="second-encounter"
                    value="second"
                    label="Second/subsequent P-MS encounter (limited to patients previously registered with Precision-MS)"
                    infoContent={
                      <p>
                        If Second/subsequent P-MS encounter option is clicked, it
                        means data collected related to the participant's second
                        or subsequent encounter with Precision MS research. It is
                        important to know that data collected in the second
                        encounter will establish disease progression.
                      </p>
                    }
                  />
                  <QuestionOption
                    id="other-encounter"
                    value="other"
                    label="Other (please specify)"
                    infoContent={
                      <p>
                        If Other option is clicked, it allows data collectors to
                        include free text to describe the type of encounter that
                        may not be captured in the previous two options. These
                        options are reviewed by the Precision MS team and included
                        in future drop-down options.
                      </p>
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

        {/* Section 4 - Family MS History */}
        <FamilyMSHistorySection />

        {/* Submit Button */}
        <div className="pt-4 border-t border-border">
          <Button className="w-full sm:w-auto">Save & Continue</Button>
        </div>
      </div>

      {/* Chatbot */}
      <ChatbotPopup />
    </div>
  );
};

export default ClinicalQuestionnaire;
