import { Ghost } from "lucide-react";
import { PropsWithChildren } from "react";

type Props = {
  title: string;
  description: string;
};

export const EmptyState: React.FC<PropsWithChildren<Props>> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="overflow-hidden border rounded-md border-zinc-300 bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700">
      <div className="flex flex-col items-center gap-4 p-8">
        <Ghost className="animate-pulse" />
        <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
};
