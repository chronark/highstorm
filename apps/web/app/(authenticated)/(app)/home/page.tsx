import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/prisma/db";

import { auth } from "@clerk/nextjs/app-beta";
import { PageHeader } from "@/components/page-header";
import { useUser } from "@clerk/clerk-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { getEvents } from "@/lib/tinybird";
import { getTenantId } from "@/lib/auth";

export default async function Page(_props: {
  params: { tenantSlug: string };
}) {
  const tenantId = getTenantId();
  const events = await getEvents({
    tenantId,
    since: Date.now() - 1000 * 60 * 60 * 24 * 7,
  });

  const tenant = await db.tenant.findUnique({
    where: {
      id: tenantId,
    },
    include: {
      channels: true,
    },
  });
  if (!tenant) {
    return notFound();
  }

  const channelIdToSlug = tenant.channels.reduce((acc, c) => {
    acc[c.id] = c.name;
    return acc;
  }, {} as Record<string, string>);

  const days = events.data
    .sort((a, b) => b.time - a.time)
    .reduce((acc, e) => {
      const key = new Date(e.time).toDateString();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(e);
      return acc;
    }, {} as Record<string, typeof events["data"]>);

  const stats: {
    label: string;
    value: string;
  }[] = [
    {
      label: "Total Channels",
      value: tenant.channels.length.toLocaleString(),
    },
    {
      label: "Total Events",
      value: events.data.length.toLocaleString(),
    },
  ];
  return (
    <main>
      <div className="relative isolate overflow-hidden pt-16">
        {/* Stats */}
        <div className="border-b border-b-white/10 lg:border-t lg:border-t-white/5">
          <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
            {stats.map((stat, statIdx) => (
              <div
                key={stat.label}
                className={cn(
                  statIdx % 2 === 1 ? "sm:border-l" : statIdx === 2 ? "lg:border-l" : "",
                  "flex items-baseline flex-wrap justify-between gap-y-2 gap-x-4 border-t border-zinc-100/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8",
                )}
              >
                <dt className="text-sm font-medium leading-6 text-zinc-500">{stat.label}</dt>
                {/* <dd
                  className={cn(
                    stat.changeType === 'negative' ? 'text-rose-600' : 'text-zinc-700',
                    'text-xs font-medium'
                  )}
                >
                  {stat.change}
                </dd> */}
                <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-zinc-100">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="space-y-16 py-16 xl:space-y-20">
        {/* Recent activity table */}
        <div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mx-auto max-w-2xl text-base font-semibold leading-6 text-zinc-100 lg:mx-0 lg:max-w-none">
              Recent activity
            </h2>
          </div>
          <div className="mt-6 overflow-hidden border-t border-zinc-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                <table className="w-full text-left">
                  <thead className="sr-only">
                    <tr>
                      <th>Amount</th>
                      <th className="hidden sm:table-cell">Client</th>
                      <th>More details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(days).map(([day, events]) => (
                      <Fragment key={day}>
                        <tr className="text-sm leading-6 text-zinc-100 ">
                          <th
                            scope="colgroup"
                            colSpan={3}
                            className="relative isolate py-2 font-semibold"
                          >
                            <time dateTime={day}>{day}</time>
                            <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-zinc-800 bg-zinc-950" />
                            <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-zinc-800 bg-zinc-950" />
                          </th>
                        </tr>
                        {events.map((event) => (
                          <tr key={event.id} className="group">
                            <td className="relative py-5 pr-6">
                              <div className="flex gap-x-6">
                                {/* <transaction.icon
                                className="hidden h-6 w-5 flex-none text-zinc-400 sm:block"
                                aria-hidden="true"
                              /> */}
                                <div className="flex-auto">
                                  <div className="flex items-start gap-x-3">
                                    <div className="text-sm font-medium leading-6 text-zinc-100">
                                      {event.event}
                                    </div>
                                    {/* <div
                                    className={classNames(
                                      statuses[transaction.status],
                                      'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                                    )}
                                  >
                                    {transaction.status}
                                  </div> */}
                                  </div>
                                  <div className="mt-1 text-xs leading-5 text-zinc-400">
                                    {new Date(event.time).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="absolute bottom-0 right-full h-px w-screen bg-zinc-900" />
                              <div className="absolute bottom-0 left-0 h-px w-screen bg-zinc-900" />
                            </td>
                            <td className="hidden py-5 pr-6 sm:table-cell">
                              <div className="text-sm leading-6 text-zinc-100">{event.content}</div>
                            </td>
                            <td className="py-5 text-right">
                              <div className="flex justify-end">
                                <Link
                                  href={`/${channelIdToSlug[event.channelId]}/events/${event.id}`}
                                  className="text-sm font-medium  leading-6 text-primary-400 group-hover:text-primary-500"
                                >
                                  View<span className="hidden sm:inline"> event</span>
                                </Link>
                              </div>
                              <div className="mt-1 text-xs leading-5 text-zinc-500">
                                <span className="text-zinc-400 group-hover:text-zinc-200">
                                  {event.id}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
