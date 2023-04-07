import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/prisma/db";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { DeleteReportButton } from "./deleteReportButton";
import { getSession } from "@/lib/auth";
import { EmptyState } from "@/components/empty-state";
import { CreateReportButton } from "../createReportButton";
import { DropdownMenu, DropdownMenuContent } from "@/components/ui/dropdown-menu";

export default async function Page(props: { params: { teamSlug: string; channelName: string } }) {
  const { session } = await getSession();
  if (!session) {
    return notFound();
  }
  const channel = await db.channel.findFirst({
    where: {
      AND: {
        name: props.params.channelName,
        team: {
          slug: props.params.teamSlug,
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    },
    include: {
      reports: true,
      team: {
        include: {
          members: true,
        },
      },
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
              className="flex items-center justify-between p-4 border rounded border-neutral-200"
            >
              <div>
                <span className="px-2 py-1 font-mono text-sm border rounded bg-neutral-50 border-neutral-200 min-w-max">
                  {report.cron}
                </span>
                <p className="mx-1 mt-2 text-xs text-neutral-500">
                  Covering the last {report.timeframe} hours
                </p>
              </div>
              <DeleteReportButton reportId={report.id} />

              {/* ">
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium truncate text-emerald-600">{key.name}</p>
                                   
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <pre className="flex items-center text-sm text-gray-500">
                                        api_XXXX{key.lastCharacters}
                                        </pre>

                                    </div>
                                    <div className="flex items-center mt-2 text-sm text-gray-500 sm:mt-0">
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
