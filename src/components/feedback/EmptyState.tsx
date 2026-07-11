import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
      <Inbox className="mb-4 h-10 w-10 text-muted-foreground" />

      <h3 className="font-semibold">{title}</h3>

      <p className="mt-2 max-w-sm text-center text-muted-foreground">
        {description}
      </p>
    </div>
  );
}