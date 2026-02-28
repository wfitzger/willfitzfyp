import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SectionList, { sections } from "./SectionList";
import ClinicalVisitSection from "./sections/ClinicalVisitSection";
import FamilyMSHistorySection from "./FamilyMSHistorySection";
import MSProgressionSection from "./sections/MSProgressionSection";
import PlaceholderSection from "./sections/PlaceholderSection";
import ChatbotPopup from "./ChatbotPopup";
import InfoTooltip from "./InfoTooltip";

const ClinicalQuestionnaire = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const handleSectionSelect = (sectionId: number) => {
    setActiveSection(sectionId);
  };

  const handleBackToList = () => {
    setActiveSection(null);
  };

  const currentSection = sections.find((s) => s.id === activeSection);

  const getQuestionTypeLabel = (type: "non-clinical" | "clinical" | "mixed") => {
    switch (type) {
      case "non-clinical":
        return "All non-clinical questions";
      case "clinical":
        return "All clinical questions";
      case "mixed":
        return "Mix of clinical and non-clinical questions";
    }
  };

  const renderSectionContent = () => {
    if (!currentSection) return null;

    switch (activeSection) {
      case 2:
        return <ClinicalVisitSection />;
      case 4:
        return <FamilyMSHistorySection />;
      case 6:
        return <MSProgressionSection />;
      default:
        return (
          <PlaceholderSection
            sectionNumber={currentSection.id}
            title={currentSection.title}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {activeSection === null ? (
          <SectionList onSectionSelect={handleSectionSelect} />
        ) : (
          <>
            {/* Back Button and Section Header */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
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
                  {activeSection === 2 && (
                    <InfoTooltip>
                      <p>An encounter is any interaction between a patient and a healthcare provider. Complete this section before entering any data.</p>
                    </InfoTooltip>
                  )}
                  {activeSection === 4 && (
                    <InfoTooltip>
                      <p>Captures <strong>biological family</strong> members with a <strong>confirmed MS diagnosis</strong> to determine disease spread across families.</p>
                    </InfoTooltip>
                  )}
                  {activeSection === 6 && (
                    <InfoTooltip>
                      <p>Tracks disease progression through tests (MRI, biomarkers, monitoring tools). Complete from the <strong>second encounter onwards</strong>. Contains clinical questions requiring a healthcare professional.</p>
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

            {/* Section Content */}
            {renderSectionContent()}

            {/* Save Button */}
            <div className="pt-4 border-t border-border flex gap-3">
              <Button variant="outline" onClick={handleBackToList}>
                Back to sections
              </Button>
              <Button className="flex-1 sm:flex-none">Save & Continue</Button>
            </div>
          </>
        )}
      </div>

      {/* Chatbot */}
      <ChatbotPopup />
    </div>
  );
};

export default ClinicalQuestionnaire;
