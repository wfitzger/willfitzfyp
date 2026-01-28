import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

export interface Section {
  id: number;
  title: string;
  questionType: "non-clinical" | "clinical" | "mixed";
}

export const sections: Section[] = [
  { id: 1, title: "Index Capsule", questionType: "non-clinical" },
  { id: 2, title: "Clinical Visit Information", questionType: "non-clinical" },
  { id: 3, title: "Demographic Information", questionType: "non-clinical" },
  { id: 4, title: "Family MS History", questionType: "non-clinical" },
  { id: 5, title: "MS Diagnostic History", questionType: "mixed" },
  { id: 6, title: "MS Progression Information", questionType: "mixed" },
  { id: 7, title: "Medication (DMT and Symptom management)", questionType: "non-clinical" },
  { id: 8, title: "Participant Medical Information", questionType: "non-clinical" },
  { id: 9, title: "Smoking, Alcohol and Recreational Cannabis Use", questionType: "non-clinical" },
  { id: 10, title: "Pregnancy", questionType: "non-clinical" },
  { id: 11, title: "Cervical Screening", questionType: "non-clinical" },
  { id: 12, title: "Autologous Hematopoietic Stem-Cell Transplantation (HSCT)", questionType: "non-clinical" },
  { id: 13, title: "Clinical Trials/Open label", questionType: "non-clinical" },
  { id: 14, title: "Cognition and Behaviour Information", questionType: "mixed" },
  { id: 15, title: "Endpoints and Vital Status", questionType: "mixed" },
];

const getQuestionTypeLabel = (type: Section["questionType"]) => {
  switch (type) {
    case "non-clinical":
      return "All non-clinical questions";
    case "clinical":
      return "All clinical questions";
    case "mixed":
      return "Mix of clinical and non-clinical questions";
  }
};

const getQuestionTypeBadgeVariant = (type: Section["questionType"]) => {
  switch (type) {
    case "non-clinical":
      return "secondary";
    case "clinical":
      return "default";
    case "mixed":
      return "outline";
  }
};

interface SectionListProps {
  onSectionSelect: (sectionId: number) => void;
}

const SectionList = ({ onSectionSelect }: SectionListProps) => {
  return (
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
        {sections.map((section) => (
          <Card
            key={section.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group"
            onClick={() => onSectionSelect(section.id)}
          >
            <CardContent className="py-4 px-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Section {section.id}
                    </span>
                    <Badge variant={getQuestionTypeBadgeVariant(section.questionType)}>
                      {section.questionType === "mixed" ? "Mixed" : section.questionType === "clinical" ? "Clinical" : "Non-clinical"}
                    </Badge>
                  </div>
                  <h3 className="text-base font-medium text-foreground truncate">
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
  );
};

export default SectionList;
