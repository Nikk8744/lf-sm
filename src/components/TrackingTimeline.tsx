import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface TrackingStep {
  id: string;
  status: string;
  message?: string | null;
  location?: string | null;
  createdAt: Date;
  updatedBy: string;
}

interface TrackingTimelineProps {
  steps: TrackingStep[];
  currentStatus: string;
}

const statusConfig = {
  ORDER_PLACED: { label: "Order Placed", color: "bg-blue-500" },
  CONFIRMED: { label: "Payment Confirmed", color: "bg-green-500" },
  PROCESSING: { label: "Processing", color: "bg-yellow-500" },
  PACKED: { label: "Packed", color: "bg-purple-500" },
  SHIPPED: { label: "Shippinggg", color: "bg-orange-500" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "bg-pink-500" },
  DELIVERED: { label: "Delivered", color: "bg-green-500" },
};



export function TrackingTimeline({ steps, currentStatus }: TrackingTimelineProps) {
  const sortedSteps = [...steps].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-8">
      {sortedSteps.map((step, index) => (
        <div key={step.id} className="relative flex gap-6">
          {/* Timeline line */}
          {index !== sortedSteps.length - 1 && (
            <div className="absolute left-[15px] top-[24px] h-full w-[2px] bg-muted" />
          )}

          {/* Status icon */}
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {step.status === currentStatus ? (
                    <Clock className="h-8 w-8 text-blue-500" />
                  ) : index === 0 ? (
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  ) : (
                    <Circle className="h-8 w-8 text-muted-foreground" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{statusConfig[step.status as keyof typeof statusConfig].label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Status content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "rounded-full",
                  statusConfig[step.status as keyof typeof statusConfig].color,
                  "text-white"
                )}
              >
                {statusConfig[step.status as keyof typeof statusConfig].label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {format(new Date(step.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>

            {(step.message || step.location) && (
              <div className="text-sm text-muted-foreground">
                {step.message && <p>{step.message}</p>}
                {step.location && (
                  <p className="flex items-center gap-1">
                    📍 {step.location}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}