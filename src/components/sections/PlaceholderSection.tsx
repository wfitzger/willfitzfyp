import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderSectionProps {
  sectionNumber: number;
  title: string;
}

const PlaceholderSection = ({ sectionNumber, title }: PlaceholderSectionProps) => {
  return (
    <Card className="border-dashed">
      <CardContent className="py-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Construction className="h-12 w-12 text-muted-foreground/50" />
          <div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              Section {sectionNumber}: {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              This section is under development and will be available soon.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceholderSection;
