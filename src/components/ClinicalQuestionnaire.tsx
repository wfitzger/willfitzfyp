import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SectionList, { sections } from "./SectionList";
import ClinicalVisitSection from "./sections/ClinicalVisitSection";
import FamilyMSHistorySection from "./FamilyMSHistorySection";
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
                  )}
                  {activeSection === 4 && (
                    <InfoTooltip>
                      <p className="mb-3">
                        In this section, we are interested in capturing information related
                        to the participant's biological family (to determine the spread of
                        disease across families). Please ensure all relations captured are
                        biological family members and have a confirmed diagnosis of MS.
                      </p>
                      <p>
                        This section should be completed at the first clinical encounter. If
                        not completed, it should be reviewed at the earliest opportunity.
                        Second and subsequent encounters should check that no information
                        has changed.
                      </p>
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
