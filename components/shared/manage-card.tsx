import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ManageCardProps = {
  title: string;
  children: React.ReactNode;
  /** Optional icon or element in the header (e.g. <StickyNote className="size-4" />) */
  headerRight?: React.ReactNode;
  className?: string;
};

export function ManageCard({ title, children, headerRight, className }: ManageCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="border-b border-border bg-muted/30 px-6 py-3">
        <h2
          className={cn(
            "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
            headerRight && "flex items-center gap-2"
          )}
        >
          {headerRight}
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </Card>
  );
}
