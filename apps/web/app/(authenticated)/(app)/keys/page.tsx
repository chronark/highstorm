import { notFound } from "next/navigation";
import { db } from "@/prisma/db";

import { PageHeader } from "@/components/page-header";
import { CreateKeyButton } from "./create-key";
import { DeleteKeyButton } from "./delete-key";
import { getTenantId } from "@/lib/auth";
import { Fragment } from "react";

export default async function Page(_props: { params: { tenantSlug: string } }) {
  const tenantId = getTenantId();
  const tenant = await db.tenant.findUnique({
    where: {
      id: tenantId,
    },
    include: {
      apikeys: true,
    },
  });
  if (!tenant) {
    return notFound();
  }

  return (
    <main>
      <div className="space-y-16 py-16 xl:space-y-20">
        {/* Recent activity table */}
        <div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PageHeader title="ApiKeys" actions={[<CreateKeyButton key="create-key" />]} />
          </div>
          <div className="mt-6 overflow-y-scroll border-t border-zinc-900">
            <div className="mx-auto max-w-7xl ">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                <table className="w-full text-left ">
                  <thead className="sr-only">
                    <tr>
                      <th>Event</th>
                      <th className="hidden sm:table-cell">Content</th>
                      <th>More details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenant.apikeys.map((key) => (
                      <tr key={key.id} className="hover:bg-zinc-800 duration-1000 ">
                        <td className="relative py-5 pr-6  pl-4 sm:pl-6 lg:pl-8">
                          <div className="flex-auto">
                            <div className="flex items-start gap-x-3">
                              <span className="px-2 py-1 font-mono text-sm border rounded bg-zinc-50 border-zinc-200 min-w-max dark:bg-zinc-900 dark:border-zinc-700">
                                api_XXXXXXXXXXXX{key.lastCharacters}
                              </span>
                              {/* <div
                                    className={classNames(
                                      statuses[transaction.status],
                                      'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                                    )}
                                  >
                                    {transaction.status}
                                  </div> */}
                            </div>
                          </div>
                          <div className="absolute bottom-0 right-full h-px w-screen bg-zinc-900" />
                          <div className="absolute bottom-0 left-0 h-px w-screen bg-zinc-900" />
                        </td>
                        <td className="hidden py-5 pr-6 sm:table-cell">
                          <div className="text-sm leading-6 text-zinc-100">
                            {" "}
                            {new Date(key.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-5 text-right pl-4 sm:pr-6 rg:pr-8">
                          <DeleteKeyButton keyId={key.id} />
                        </td>
                      </tr>
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
