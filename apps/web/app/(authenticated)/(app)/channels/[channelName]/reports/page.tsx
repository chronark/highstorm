import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/prisma/db";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { DeleteReportButton } from "./deleteReportButton";
import { auth } from "@clerk/nextjs/app-beta";
import { EmptyState } from "@/components/empty-state";
import { CreateReportButton } from "../createReportButton";
import { DropdownMenu, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { getTenantId } from "@/lib/auth";

export default async function Page(props: { params: { tenantSlug: string; channelName: string } }) {
  const channel = await db.channel.findFirst({
    where: {
      AND: {
        tenant: {
          id: getTenantId(),
        },
        name: props.params.channelName,
      },
    },
    include: {
      reports: true,
      tenant: true,
    },
  });
  if (!channel) {
    return notFound();
  }

  return (
    <div className="mt-8">
      {channel.reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Create your first report by clicking the menu button above"
        />
      ) : (
        <ul role="list" className="space-y-4">
          {channel.reports.map((report) => (
            <li
              key={report.id}
              className="flex items-center justify-between p-4 border rounded border-zinc-200 dark:border-zinc-800"
            >
              <div>
                <span className="px-2 py-1 font-mono text-sm border rounded bg-zinc-50 border-zinc-200 min-w-max dark:bg-zinc-900 dark:border-zinc-700">
                  {report.cron}
                </span>
                <p className="mx-1 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Covering the last {report.timeframe} hours
                </p>
              </div>
              <DeleteReportButton reportId={report.id} />

              {/* ">
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium truncate text-primary-600">{key.name}</p>
                                   
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <pre className="flex items-center text-sm text-zinc-500">
                                        api_XXXX{key.lastCharacters}
                                        </pre>

                                    </div>
                                    <div className="flex items-center mt-2 text-sm text-zinc-500 sm:mt-0">
                                        <p>
                                            Created on <time dateTime={key.createdAt.toISOString()}>{key.createdAt.toUTCString()}</time>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
