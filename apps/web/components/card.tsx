import Link from "next/link";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string;
  disabled?: boolean;
}

export function Card({ href, className, children, disabled, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-lg border border-zinc-200 bg-transparent p-6 text-zinc-900 shadow-md transition-shadow hover:shadow-lg dark:border-zinc-700 dark:text-zinc-50",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col justify-between space-y-4">
        <div className="space-y-2 [&>p]:text-zinc-600 [&>p]:dark:text-zinc-300 [&>h4]:!mt-0 [&>h3]:!mt-0">
          {children}
        </div>
      </div>
      {href && (
        <Link href={disabled ? "#" : href} className="absolute inset-0">
          <span className="sr-only">View</span>
        </Link>
      )}
    </div>
  );
}
