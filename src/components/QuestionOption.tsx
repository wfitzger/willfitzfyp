import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InfoTooltip from "./InfoTooltip";
import { useState } from "react";

interface QuestionOptionProps {
  id: string;
  value: string;
  label: string;
  infoContent?: React.ReactNode;
  hasOtherInput?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  isSelected?: boolean;
}

const QuestionOption = ({
  id,
  value,
  label,
  infoContent,
  hasOtherInput,
  otherValue,
  onOtherChange,
  isSelected,
}: QuestionOptionProps) => {
  return (
    <div className="flex items-start gap-3 py-2">
      <RadioGroupItem value={value} id={id} className="mt-0.5" />
      <div className="flex-1 flex items-start gap-2">
        <Label
          htmlFor={id}
          className="text-sm font-normal cursor-pointer leading-relaxed text-foreground"
        >
          {label}
        </Label>
        {infoContent && <InfoTooltip>{infoContent}</InfoTooltip>}
      </div>
      {hasOtherInput && isSelected && (
        <Input
          type="text"
          placeholder="Please specify..."
          value={otherValue}
          onChange={(e) => onOtherChange?.(e.target.value)}
          className="w-48 h-8 text-sm"
        />
      )}
    </div>
  );
};

export default QuestionOption;
