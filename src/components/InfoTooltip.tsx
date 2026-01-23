import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface InfoTooltipProps {
  children: React.ReactNode;
  className?: string;
}

const InfoTooltip = ({ children, className }: InfoTooltipProps) => {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center justify-center rounded-full p-1 text-info hover:bg-info-bg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
          aria-label="More information"
        >
          <Info className="h-4 w-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 bg-popover text-popover-foreground border border-border shadow-lg z-50"
        side="right"
        align="start"
      >
        <div className="text-sm leading-relaxed">{children}</div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default InfoTooltip;
