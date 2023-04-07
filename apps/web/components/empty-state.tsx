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
    <div className="overflow-hidden border rounded-md border-neutral-300 bg-neutral-50">
      <div className="flex flex-col items-center gap-4 p-8">
        <Ghost />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
};
