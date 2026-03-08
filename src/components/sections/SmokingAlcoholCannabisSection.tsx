import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import InfoTooltip from "@/components/InfoTooltip";

type SmokingStatus = "" | "currently" | "previously" | "never";
type VapingStatus = "" | "currently" | "previously" | "never";
type AlcoholStatus = "" | "currently" | "previously" | "never";
type CannabisStatus = "" | "currently" | "previously" | "never";
type DrugStatus = "" | "currently" | "previously" | "never";

const SmokingAlcoholCannabisSection = () => {
  // 9a Smoking
  const [smokingStatus, setSmokingStatus] = useState<SmokingStatus>("");
  const [smokingAgeStarted, setSmokingAgeStarted] = useState("");
  const [smokingAgeStopped, setSmokingAgeStopped] = useState("");
  const [smokingTypes, setSmokingTypes] = useState<string[]>([]);
  const [smokingOtherType, setSmokingOtherType] = useState("");
  const [smokingFrequency, setSmokingFrequency] = useState("");
  const [smokingFrequencyPeriod, setSmokingFrequencyPeriod] = useState("");
  const [smokingDuration, setSmokingDuration] = useState("");
  const [smokingPacksPerDay, setSmokingPacksPerDay] = useState("");
  const [smokingAdditional, setSmokingAdditional] = useState("");

  // 9a-b Vaping
  const [vapingStatus, setVapingStatus] = useState<VapingStatus>("");
  const [vapingAgeStarted, setVapingAgeStarted] = useState("");
  const [vapingAgeStopped, setVapingAgeStopped] = useState("");
  const [vapingBottleSize, setVapingBottleSize] = useState("");
  const [vapingDaysPerBottle, setVapingDaysPerBottle] = useState("");
  const [vapingDuration, setVapingDuration] = useState("");
  const [vapingAdditional, setVapingAdditional] = useState("");

  // 9b Alcohol
  const [alcoholStatus, setAlcoholStatus] = useState<AlcoholStatus>("");
  const [alcoholAgeStarted, setAlcoholAgeStarted] = useState("");
  const [alcoholAgeStopped, setAlcoholAgeStopped] = useState("");
  const [alcoholFrequency, setAlcoholFrequency] = useState("");
  const [alcoholOtherFrequency, setAlcoholOtherFrequency] = useState("");
  const [alcoholUnitsPerWeek, setAlcoholUnitsPerWeek] = useState("");
  const [alcoholAdditional, setAlcoholAdditional] = useState("");

  // 9c-a Cannabis
  const [cannabisStatus, setCannabisStatus] = useState<CannabisStatus>("");
  const [cannabisAgeStarted, setCannabisAgeStarted] = useState("");
  const [cannabisAgeStopped, setCannabisAgeStopped] = useState("");
  const [cannabisForm, setCannabisForm] = useState("");
  const [cannabisFrequency, setCannabisFrequency] = useState("");
  const [cannabisDuration, setCannabisDuration] = useState("");
  const [cannabisAdditional, setCannabisAdditional] = useState("");

  // 9c-b Other drugs
  const [drugStatus, setDrugStatus] = useState<DrugStatus>("");
  const [drugType, setDrugType] = useState("");
  const [drugAgeStarted, setDrugAgeStarted] = useState("");
  const [drugAgeStopped, setDrugAgeStopped] = useState("");
  const [drugForm, setDrugForm] = useState("");
  const [drugFrequency, setDrugFrequency] = useState("");
  const [drugDuration, setDrugDuration] = useState("");
  const [drugAdditional, setDrugAdditional] = useState("");

  const smokingPackYears = useMemo(() => {
    const duration = parseFloat(smokingDuration);
    const packs = parseFloat(smokingPacksPerDay);
    if (!isNaN(duration) && !isNaN(packs)) {
      return (duration * packs).toFixed(1);
    }
    return "";
  }, [smokingDuration, smokingPacksPerDay]);

  const vapingDurationAuto = useMemo(() => {
    const start = parseFloat(vapingAgeStarted);
    const stop = parseFloat(vapingAgeStopped);
    if (vapingStatus === "previously" && !isNaN(start) && !isNaN(stop) && stop >= start) {
      return (stop - start).toString();
    }
    return vapingDuration;
  }, [vapingAgeStarted, vapingAgeStopped, vapingStatus, vapingDuration]);

  const cannabisDurationAuto = useMemo(() => {
    const start = parseFloat(cannabisAgeStarted);
    const stop = parseFloat(cannabisAgeStopped);
    if (cannabisStatus === "previously" && !isNaN(start) && !isNaN(stop) && stop >= start) {
      return (stop - start).toString();
    }
    return cannabisDuration;
  }, [cannabisAgeStarted, cannabisAgeStopped, cannabisStatus, cannabisDuration]);

  const drugDurationAuto = useMemo(() => {
    const start = parseFloat(drugAgeStarted);
    const stop = parseFloat(drugAgeStopped);
    if (drugStatus === "previously" && !isNaN(start) && !isNaN(stop) && stop >= start) {
      return (stop - start).toString();
    }
    return drugDuration;
  }, [drugAgeStarted, drugAgeStopped, drugStatus, drugDuration]);

  const handleSmokingTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSmokingTypes([...smokingTypes, type]);
    } else {
      setSmokingTypes(smokingTypes.filter((t) => t !== type));
    }
  };

  const showSmokingDetails = smokingStatus === "currently" || smokingStatus === "previously";
  const showVapingDetails = vapingStatus === "currently" || vapingStatus === "previously";
  const showAlcoholDetails = alcoholStatus === "currently" || alcoholStatus === "previously";
  const showCannabisDetails = cannabisStatus === "currently" || cannabisStatus === "previously";
  const showDrugDetails = drugStatus === "currently" || drugStatus === "previously";

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li><strong>First visit/first interview:</strong> ask all questions</li>
            <li><strong>Second or subsequent visit/interview:</strong> Check if any answers have changed since the last visit.</li>
          </ul>
        </CardContent>
      </Card>

      {/* 9a. Smoking History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">a. Smoking History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Question a - Smoking status */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-foreground">
              Smoking history: Has the participant ever smoked (tobacco)?
            </Label>
            <RadioGroup value={smokingStatus} onValueChange={(v) => setSmokingStatus(v as SmokingStatus)} className="pl-4 space-y-2">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="currently" id="smoking-currently" />
                <Label htmlFor="smoking-currently" className="text-sm font-normal cursor-pointer select-none">Yes, currently smoking</Label>
                {smokingStatus === "currently" && (
                  <div className="flex items-center gap-2 ml-2">
                    <Label className="text-xs text-muted-foreground whitespace-nowrap">Age started:</Label>
                    <Input type="number" value={smokingAgeStarted} onChange={(e) => setSmokingAgeStarted(e.target.value)} className="w-20 h-8 text-sm" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <RadioGroupItem value="previously" id="smoking-previously" />
                <Label htmlFor="smoking-previously" className="text-sm font-normal cursor-pointer select-none">Yes, but not currently smoking</Label>
                {smokingStatus === "previously" && (
                  <div className="flex items-center gap-4 ml-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Age started:</Label>
                      <Input type="number" value={smokingAgeStarted} onChange={(e) => setSmokingAgeStarted(e.target.value)} className="w-20 h-8 text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Age stopped:</Label>
                      <Input type="number" value={smokingAgeStopped} onChange={(e) => setSmokingAgeStopped(e.target.value)} className="w-20 h-8 text-sm" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="never" id="smoking-never" />
                <Label htmlFor="smoking-never" className="text-sm font-normal cursor-pointer select-none">Never smoked</Label>
              </div>
            </RadioGroup>
          </div>

          {showSmokingDetails && (
            <>
              {/* Smoking type */}
              <div className="space-y-3 pl-4">
                <Label className="text-sm font-medium text-foreground">
                  If the participant has ever smoked/currently smoking:
                </Label>
                <div className="flex flex-wrap gap-4">
                  {["Cigarettes", "Cigars", "Pipe", "Roll Your Own"].map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <Checkbox
                        id={`smoke-type-${type.toLowerCase().replace(/\s+/g, "-")}`}
                        checked={smokingTypes.includes(type)}
                        onCheckedChange={(checked) => handleSmokingTypeChange(type, checked as boolean)}
                      />
                      <Label
                        htmlFor={`smoke-type-${type.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm font-normal cursor-pointer select-none"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="smoke-type-other"
                      checked={smokingTypes.includes("Other")}
                      onCheckedChange={(checked) => handleSmokingTypeChange("Other", checked as boolean)}
                    />
                    <Label htmlFor="smoke-type-other" className="text-sm font-normal cursor-pointer select-none">Other</Label>
                    {smokingTypes.includes("Other") && (
                      <Input
                        placeholder="Please specify..."
                        value={smokingOtherType}
                        onChange={(e) => setSmokingOtherType(e.target.value)}
                        className="w-40 h-8 text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Frequency */}
              <div className="space-y-3 pl-4">
                <Label className="text-sm font-medium text-foreground">
                  How many cigarettes:
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={smokingFrequency}
                    onChange={(e) => setSmokingFrequency(e.target.value)}
                    placeholder="Number"
                    className="w-28 h-8 text-sm"
                  />
                  <RadioGroup value={smokingFrequencyPeriod} onValueChange={setSmokingFrequencyPeriod} className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="per-week" id="freq-per-week" />
                      <Label htmlFor="freq-per-week" className="text-sm font-normal cursor-pointer select-none">Per Week</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="per-month" id="freq-per-month" />
                      <Label htmlFor="freq-per-month" className="text-sm font-normal cursor-pointer select-none">Per Month</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Additional smoking text */}
              <div className="space-y-2 pl-4">
                <Label className="text-sm text-muted-foreground">Add participant's additional smoking history here:</Label>
                <Textarea
                  value={smokingAdditional}
                  onChange={(e) => setSmokingAdditional(e.target.value)}
                  placeholder="Enter additional smoking history..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Duration / Packs / Pack Years */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Duration of smoking (total years)</Label>
                  <Input type="number" value={smokingDuration} onChange={(e) => setSmokingDuration(e.target.value)} placeholder="Years" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">No. of packs a day (20 cigs/pack)</Label>
                  <Input type="number" step="0.1" value={smokingPacksPerDay} onChange={(e) => setSmokingPacksPerDay(e.target.value)} placeholder="Packs" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Label className="text-sm text-muted-foreground">Smoking Pack Years</Label>
                    <InfoTooltip>
                      <p>Auto-calculated: Duration (years) × Packs per day</p>
                    </InfoTooltip>
                  </div>
                  <Input value={smokingPackYears} readOnly placeholder="Auto-calculated" className="h-8 text-sm bg-muted/50" />
                </div>
              </div>
            </>
          )}

          {/* Question b - Vaping */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Label className="text-base font-medium text-foreground">
              Vaping history: Has the participant ever vaped?
            </Label>
            <RadioGroup value={vapingStatus} onValueChange={(v) => setVapingStatus(v as VapingStatus)} className="pl-4 space-y-2">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="currently" id="vaping-currently" />
                <Label htmlFor="vaping-currently" className="text-sm font-normal cursor-pointer select-none">Yes, currently vaping</Label>
                {vapingStatus === "currently" && (
                  <div className="flex items-center gap-2 ml-2">
                    <Label className="text-xs text-muted-foreground whitespace-nowrap">Age started:</Label>
                    <Input type="number" value={vapingAgeStarted} onChange={(e) => setVapingAgeStarted(e.target.value)} className="w-20 h-8 text-sm" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <RadioGroupItem value="previously" id="vaping-previously" />
                <Label htmlFor="vaping-previously" className="text-sm font-normal cursor-pointer select-none">Yes, but not currently vaping</Label>
                {vapingStatus === "previously" && (
                  <div className="flex items-center gap-4 ml-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Age started:</Label>
                      <Input type="number" value={vapingAgeStarted} onChange={(e) => setVapingAgeStarted(e.target.value)} className="w-20 h-8 text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Age stopped:</Label>
                      <Input type="number" value={vapingAgeStopped} onChange={(e) => setVapingAgeStopped(e.target.value)} className="w-20 h-8 text-sm" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="never" id="vaping-never" />
                <Label htmlFor="vaping-never" className="text-sm font-normal cursor-pointer select-none">Never vaped</Label>
              </div>
            </RadioGroup>
          </div>

          {showVapingDetails && (
            <div className="space-y-4 pl-4">
              <Label className="text-sm font-medium text-foreground">
                If participant ever vaped/currently vaping:
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Bottle size (ml)</Label>
                  <Input type="number" value={vapingBottleSize} onChange={(e) => setVapingBottleSize(e.target.value)} placeholder="ml" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Days per bottle</Label>
                  <Input type="number" value={vapingDaysPerBottle} onChange={(e) => setVapingDaysPerBottle(e.target.value)} placeholder="Days" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Label className="text-sm text-muted-foreground">Duration of vaping (total years)</Label>
                    <InfoTooltip>
                      <p>Auto-calculated from age started and age stopped when available.</p>
                    </InfoTooltip>
                  </div>
                  <Input
                    type="number"
                    value={vapingStatus === "previously" ? vapingDurationAuto : vapingDuration}
                    onChange={(e) => setVapingDuration(e.target.value)}
                    readOnly={vapingStatus === "previously" && vapingDurationAuto !== vapingDuration}
                    placeholder={vapingStatus === "previously" ? "Auto-calculated" : "Years"}
                    className={`h-8 text-sm ${vapingStatus === "previously" && vapingDurationAuto !== vapingDuration ? "bg-muted/50" : ""}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Add participant's additional vaping history here:</Label>
                <Textarea
                  value={vapingAdditional}
                  onChange={(e) => setVapingAdditional(e.target.value)}
                  placeholder="Enter additional vaping history..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 9b. Alcohol Consumption */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">b. Alcohol Consumption</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <Label className="text-base font-medium text-foreground">
              Alcohol history: Has the participant ever consumed alcohol?
            </Label>
            <RadioGroup value={alcoholStatus} onValueChange={(v) => setAlcoholStatus(v as AlcoholStatus)} className="pl-4 space-y-2">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="currently" id="alcohol-currently" />
                <Label htmlFor="alcohol-currently" className="text-sm font-normal cursor-pointer select-none">Yes, currently consuming alcohol</Label>
                {alcoholStatus === "currently" && (
                  <div className="flex items-center gap-2 ml-2">
                    <Label className="text-xs text-muted-foreground whitespace-nowrap">Age started:</Label>
                    <Input type="number" value={alcoholAgeStarted} onChange={(e) => setAlcoholAgeStarted(e.target.value)} className="w-20 h-8 text-sm" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <RadioGroupItem value="previously" id="alcohol-previously" />
                <Label htmlFor="alcohol-previously" className="text-sm font-normal cursor-pointer select-none">Yes, but not currently consuming alcohol</Label>
                {alcoholStatus === "previously" && (
                  <div className="flex items-center gap-4 ml-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Age started:</Label>
                      <Input type="number" value={alcoholAgeStarted} onChange={(e) => setAlcoholAgeStarted(e.target.value)} className="w-20 h-8 text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Age stopped:</Label>
                      <Input type="number" value={alcoholAgeStopped} onChange={(e) => setAlcoholAgeStopped(e.target.value)} className="w-20 h-8 text-sm" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="never" id="alcohol-never" />
                <Label htmlFor="alcohol-never" className="text-sm font-normal cursor-pointer select-none">Never consumed alcohol</Label>
              </div>
            </RadioGroup>
          </div>

          {showAlcoholDetails && (
            <div className="space-y-4 pl-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">How often do/did they drink alcohol?</Label>
                <RadioGroup value={alcoholFrequency} onValueChange={setAlcoholFrequency} className="flex flex-wrap gap-4">
                  {["Daily", "Weekly", "Monthly"].map((freq) => (
                    <div key={freq} className="flex items-center gap-2">
                      <RadioGroupItem value={freq.toLowerCase()} id={`alcohol-freq-${freq.toLowerCase()}`} />
                      <Label htmlFor={`alcohol-freq-${freq.toLowerCase()}`} className="text-sm font-normal cursor-pointer select-none">{freq}</Label>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="other" id="alcohol-freq-other" />
                    <Label htmlFor="alcohol-freq-other" className="text-sm font-normal cursor-pointer select-none">Other</Label>
                    {alcoholFrequency === "other" && (
                      <Input
                        placeholder="Please specify..."
                        value={alcoholOtherFrequency}
                        onChange={(e) => setAlcoholOtherFrequency(e.target.value)}
                        className="w-40 h-8 text-sm"
                      />
                    )}
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Label className="text-sm text-muted-foreground">Average units per week</Label>
                  <InfoTooltip>
                    <p>A unit of alcohol is 10ml or 8g of pure alcohol. For example: a single measure of spirits (25ml) = 1 unit, a pint of lower-strength lager/beer/cider = 2 units, a standard glass of wine (175ml) = 2.1 units.</p>
                  </InfoTooltip>
                </div>
                <Input type="number" value={alcoholUnitsPerWeek} onChange={(e) => setAlcoholUnitsPerWeek(e.target.value)} placeholder="Units/week" className="w-40 h-8 text-sm" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Add the participant's additional alcohol consumption history here:</Label>
                <Textarea
                  value={alcoholAdditional}
                  onChange={(e) => setAlcoholAdditional(e.target.value)}
                  placeholder="Enter additional alcohol history..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 9c. Recreational Drug Use including cannabis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">c. Recreational Drug Use including Cannabis Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Cannabis */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-foreground">
              Recreational cannabis: Has the participant ever taken recreational cannabis?
            </Label>
            <RadioGroup value={cannabisStatus} onValueChange={(v) => setCannabisStatus(v as CannabisStatus)} className="pl-4 space-y-2">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="currently" id="cannabis-currently" />
                <Label htmlFor="cannabis-currently" className="text-sm font-normal cursor-pointer select-none">Yes</Label>
                {cannabisStatus === "currently" && (
                  <div className="flex items-center gap-2 ml-2">
                    <Label className="text-xs text-muted-foreground whitespace-nowrap">Age started:</Label>
                    <Input type="number" value={cannabisAgeStarted} onChange={(e) => setCannabisAgeStarted(e.target.value)} className="w-20 h-8 text-sm" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <RadioGroupItem value="previously" id="cannabis-previously" />
                <Label htmlFor="cannabis-previously" className="text-sm font-normal cursor-pointer select-none">Yes, but not currently taking recreational cannabis</Label>
                {cannabisStatus === "previously" && (
                  <div className="flex items-center gap-4 ml-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Age started:</Label>
                      <Input type="number" value={cannabisAgeStarted} onChange={(e) => setCannabisAgeStarted(e.target.value)} className="w-20 h-8 text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Age stopped:</Label>
                      <Input type="number" value={cannabisAgeStopped} onChange={(e) => setCannabisAgeStopped(e.target.value)} className="w-20 h-8 text-sm" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="never" id="cannabis-never" />
                <Label htmlFor="cannabis-never" className="text-sm font-normal cursor-pointer select-none">Never taken recreational cannabis</Label>
              </div>
            </RadioGroup>
          </div>

          {showCannabisDetails && (
            <div className="space-y-4 pl-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Form</Label>
                  <Input value={cannabisForm} onChange={(e) => setCannabisForm(e.target.value)} placeholder="e.g. Smoked, Edible" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Frequency</Label>
                  <Input value={cannabisFrequency} onChange={(e) => setCannabisFrequency(e.target.value)} placeholder="e.g. Daily, Weekly" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Label className="text-sm text-muted-foreground">Duration (total years)</Label>
                    <InfoTooltip>
                      <p>Auto-calculated from age started and age stopped when available.</p>
                    </InfoTooltip>
                  </div>
                  <Input
                    type="number"
                    value={cannabisStatus === "previously" ? cannabisDurationAuto : cannabisDuration}
                    onChange={(e) => setCannabisDuration(e.target.value)}
                    readOnly={cannabisStatus === "previously" && cannabisDurationAuto !== cannabisDuration}
                    placeholder={cannabisStatus === "previously" ? "Auto-calculated" : "Years"}
                    className={`h-8 text-sm ${cannabisStatus === "previously" && cannabisDurationAuto !== cannabisDuration ? "bg-muted/50" : ""}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Add the participant's additional recreational cannabis consumption history here:</Label>
                <Textarea
                  value={cannabisAdditional}
                  onChange={(e) => setCannabisAdditional(e.target.value)}
                  placeholder="Enter additional cannabis history..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}

          {/* Other recreational drugs */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Label className="text-base font-medium text-foreground">
              b. Other recreational drug use: Has the participant ever taken recreational drugs?
            </Label>

            <div className="pl-4 space-y-3">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Type:</Label>
                <Input value={drugType} onChange={(e) => setDrugType(e.target.value)} placeholder="Type of drug" className="w-60 h-8 text-sm" />
              </div>
            </div>

            <RadioGroup value={drugStatus} onValueChange={(v) => setDrugStatus(v as DrugStatus)} className="pl-4 space-y-2">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="currently" id="drug-currently" />
                <Label htmlFor="drug-currently" className="text-sm font-normal cursor-pointer select-none">Yes</Label>
                {drugStatus === "currently" && (
                  <div className="flex items-center gap-2 ml-2">
                    <Label className="text-xs text-muted-foreground whitespace-nowrap">Age started:</Label>
                    <Input type="number" value={drugAgeStarted} onChange={(e) => setDrugAgeStarted(e.target.value)} className="w-20 h-8 text-sm" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <RadioGroupItem value="previously" id="drug-previously" />
                <Label htmlFor="drug-previously" className="text-sm font-normal cursor-pointer select-none">Yes, but not currently taking recreational drugs</Label>
                {drugStatus === "previously" && (
                  <div className="flex items-center gap-4 ml-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Age started:</Label>
                      <Input type="number" value={drugAgeStarted} onChange={(e) => setDrugAgeStarted(e.target.value)} className="w-20 h-8 text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Age stopped:</Label>
                      <Input type="number" value={drugAgeStopped} onChange={(e) => setDrugAgeStopped(e.target.value)} className="w-20 h-8 text-sm" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="never" id="drug-never" />
                <Label htmlFor="drug-never" className="text-sm font-normal cursor-pointer select-none">Never taken recreational drugs</Label>
              </div>
            </RadioGroup>
          </div>

          {showDrugDetails && (
            <div className="space-y-4 pl-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Form</Label>
                  <Input value={drugForm} onChange={(e) => setDrugForm(e.target.value)} placeholder="e.g. Smoked, Injected" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Frequency</Label>
                  <Input value={drugFrequency} onChange={(e) => setDrugFrequency(e.target.value)} placeholder="e.g. Daily, Weekly" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Label className="text-sm text-muted-foreground">Duration (total years)</Label>
                    <InfoTooltip>
                      <p>Auto-calculated from age started and age stopped when available.</p>
                    </InfoTooltip>
                  </div>
                  <Input
                    type="number"
                    value={drugStatus === "previously" ? drugDurationAuto : drugDuration}
                    onChange={(e) => setDrugDuration(e.target.value)}
                    readOnly={drugStatus === "previously" && drugDurationAuto !== drugDuration}
                    placeholder={drugStatus === "previously" ? "Auto-calculated" : "Years"}
                    className={`h-8 text-sm ${drugStatus === "previously" && drugDurationAuto !== drugDuration ? "bg-muted/50" : ""}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Add the participant's additional recreational drug consumption history here:</Label>
                <Textarea
                  value={drugAdditional}
                  onChange={(e) => setDrugAdditional(e.target.value)}
                  placeholder="Enter additional drug history..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmokingAlcoholCannabisSection;
