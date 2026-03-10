import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { sections } from "@/components/SectionList";
import MSProgressionSection from "@/components/sections/MSProgressionSection";
import SmokingAlcoholCannabisSection from "@/components/sections/SmokingAlcoholCannabisSection";
import ChatbotPopup from "@/components/ChatbotPopup";
import InfoTooltip from "@/components/InfoTooltip";

const allowedSectionIds = [6, 9];
const limitedSections = sections.filter((s) => allowedSectionIds.includes(s.id));

const getQuestionTypeLabel = (type: "non-clinical" | "clinical" | "mixed") => {
  switch (type) {
    case "non-clinical": return "All non-clinical questions";
    case "clinical": return "All clinical questions";
    case "mixed": return "Mix of clinical and non-clinical questions";
  }
};

const getQuestionTypeBadgeClass = (type: "non-clinical" | "clinical" | "mixed") => {
  switch (type) {
    case "non-clinical": return "bg-secondary text-secondary-foreground";
    case "clinical": return "bg-primary text-primary-foreground";
    case "mixed": return "bg-orange-100 text-orange-700 border-orange-200";
  }
};

const LimitedQuestionnaire = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  const currentSection = sections.find((s) => s.id === activeSection);

  const renderSectionContent = () => {
    switch (activeSection) {
      case 6: return <MSProgressionSection />;
      case 9: return <SmokingAlcoholCannabisSection />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {activeSection === null ? (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                Clinical Questionnaire
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                Select a section to begin data collection
              </p>
            </div>
            <div className="space-y-2">
              {limitedSections.map((section) => (
                <Card
                  key={section.id}
                  className="cursor-pointer transition-all group hover:shadow-md hover:border-primary/50"
                  onClick={() => setActiveSection(section.id)}
                >
                  <CardContent className="py-4 px-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-medium text-muted-foreground">
                            Section {section.id}
                          </span>
                          <Badge className={getQuestionTypeBadgeClass(section.questionType)}>
                            {section.questionType === "mixed" ? "Mixed" : section.questionType === "clinical" ? "Clinical" : "Non-clinical"}
                          </Badge>
                        </div>
                        <h3 className="text-base font-medium truncate text-foreground">
                          {section.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {getQuestionTypeLabel(section.questionType)}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSection(null)}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sections
              </Button>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                    Section {currentSection?.id}: {currentSection?.title}
                  </h1>
                  {activeSection === 6 && (
                    <InfoTooltip>
                      <p>Tracks disease progression via MRI, biomarkers, and monitoring tools. Complete from the second encounter onwards. Contains clinical questions.</p>
                    </InfoTooltip>
                  )}
                  {activeSection === 9 && (
                    <InfoTooltip>
                      <p>Gathers information about smoking history, alcohol intake and recreational cannabis use to explore the health behaviours of the population.</p>
                    </InfoTooltip>
                  )}
                </div>
                {currentSection && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {getQuestionTypeLabel(currentSection.questionType)}
                  </p>
                )}
              </div>
            </div>
            {renderSectionContent()}
            <div className="pt-4 border-t border-border flex gap-3">
              <Button variant="outline" onClick={() => setActiveSection(null)}>
                Back to sections
              </Button>
              <Button className="flex-1 sm:flex-none">Save & Continue</Button>
            </div>
          </>
        )}
      </div>
      <ChatbotPopup />
    </div>
  );
};

export default LimitedQuestionnaire;
