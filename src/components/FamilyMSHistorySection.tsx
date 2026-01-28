import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface FamilyMember {
  id: string;
  relationship: string;
  diagnosisType: string;
  sex: string;
}

const relationshipOptions = [
  "Parent",
  "Sibling",
  "Twin (identical)",
  "Twin (non-identical)",
  "Half-sibling (maternal)",
  "Half-sibling (paternal)",
  "Child",
  "Aunt/Uncle",
  "Niece/Nephew",
  "Grandparent",
  "Grandchild",
];

const FamilyMSHistorySection = () => {
  const [hasFamilyMS, setHasFamilyMS] = useState("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "1", relationship: "", diagnosisType: "", sex: "" },
  ]);
  const [additionalDetails, setAdditionalDetails] = useState("");

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { id: Date.now().toString(), relationship: "", diagnosisType: "", sex: "" },
    ]);
  };

  const removeFamilyMember = (id: string) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter((m) => m.id !== id));
    }
  };

  const updateFamilyMember = (
    id: string,
    field: keyof FamilyMember,
    value: string
  ) => {
    setFamilyMembers(
      familyMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  return (
    <div className="space-y-6">

      {/* Intro Instructions */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>
              <strong>First visit/first interview:</strong> ask all questions
            </li>
            <li>
              <strong>Second or subsequent visit/interview:</strong> Check if any
              answers have changed since the last visit.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Questions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            Family History Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Question A */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-foreground">
              a. Have any of the participants' biological family members received
              a confirmed diagnosis of MS?
            </Label>
            <RadioGroup
              value={hasFamilyMS}
              onValueChange={setHasFamilyMS}
              className="pl-4 space-y-2"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="yes" id="family-yes" />
                <Label
                  htmlFor="family-yes"
                  className="text-sm font-normal cursor-pointer"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="no" id="family-no" />
                <Label
                  htmlFor="family-no"
                  className="text-sm font-normal cursor-pointer"
                >
                  No
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="unknown" id="family-unknown" />
                <Label
                  htmlFor="family-unknown"
                  className="text-sm font-normal cursor-pointer"
                >
                  Biological Family history unknown
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question B - Conditional */}
          {hasFamilyMS === "yes" && (
            <div className="space-y-4">
              <Label className="text-base font-medium text-foreground">
                b. If yes, please provide details of relevant biological family
                members if confirmed diagnosed MS
              </Label>

              <div className="space-y-4">
                {familyMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="p-4 bg-muted/30 rounded-lg border border-border space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        Family Member {index + 1}
                      </span>
                      {familyMembers.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFamilyMember(member.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Relationship */}
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Biological family member
                        </Label>
                        <Select
                          value={member.relationship}
                          onValueChange={(value) =>
                            updateFamilyMember(member.id, "relationship", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            {relationshipOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Diagnosis Type */}
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Type of MS diagnosed
                        </Label>
                        <RadioGroup
                          value={member.diagnosisType}
                          onValueChange={(value) =>
                            updateFamilyMember(member.id, "diagnosisType", value)
                          }
                          className="space-y-1"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="confirmed"
                              id={`diagnosis-confirmed-${member.id}`}
                            />
                            <Label
                              htmlFor={`diagnosis-confirmed-${member.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              Confirmed
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="not-confirmed"
                              id={`diagnosis-not-confirmed-${member.id}`}
                            />
                            <Label
                              htmlFor={`diagnosis-not-confirmed-${member.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              Not Confirmed
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="not-sure"
                              id={`diagnosis-not-sure-${member.id}`}
                            />
                            <Label
                              htmlFor={`diagnosis-not-sure-${member.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              Not sure type
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Sex */}
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Sex of this relative
                        </Label>
                        <RadioGroup
                          value={member.sex}
                          onValueChange={(value) =>
                            updateFamilyMember(member.id, "sex", value)
                          }
                          className="space-y-1"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="male"
                              id={`sex-male-${member.id}`}
                            />
                            <Label
                              htmlFor={`sex-male-${member.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              Male
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="female"
                              id={`sex-female-${member.id}`}
                            />
                            <Label
                              htmlFor={`sex-female-${member.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              Female
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              value="other"
                              id={`sex-other-${member.id}`}
                            />
                            <Label
                              htmlFor={`sex-other-${member.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              Other
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addFamilyMember}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Family Member
                </Button>
              </div>
            </div>
          )}

          {/* Question C */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-foreground">
              c. If the data collector needs to add extra for responses, i.e. both
              biological parents or additional biological siblings: add the
              information here.
            </Label>
            <p className="text-sm text-muted-foreground">
              Please include the relationship (i.e. biological sibling) and
              details of the relation's diagnosis. For diagnosis, please follow
              the information requested above.
            </p>
            <Textarea
              placeholder="Enter relationship and diagnosis details..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyMSHistorySection;
