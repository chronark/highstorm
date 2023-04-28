import { notFound } from "next/navigation";
import { db } from "@/prisma/db";

import { PageHeader } from "@/components/page-header";
import { CreateKeyButton } from "./create-key";
import { DeleteKeyButton } from "./delete-key";
import { getTenantId } from "@/lib/auth";

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
    <div className="">
      <PageHeader title="API Keys" actions={[<CreateKeyButton />]} />
      <ul role="list" className="mt-8 space-y-4">
        {tenant.apikeys.map((key) => (
          <li
            key={key.id}
            className="flex items-center justify-between p-4 border rounded border-zinc-200 dark:border-zinc-800"
          >
            <div>
              <span className="px-2 py-1 font-mono text-sm border rounded bg-zinc-50 border-zinc-200 min-w-max dark:bg-zinc-900 dark:border-zinc-700">
                api_XXXXXXXXXXXX{key.lastCharacters}
              </span>
              <p className="mx-1 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Created on{" "}
                <time dateTime={key.createdAt.toISOString()}>{key.createdAt.toUTCString()}</time>
              </p>
            </div>
            <DeleteKeyButton keyId={key.id} />

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
    </div>
  );
}
