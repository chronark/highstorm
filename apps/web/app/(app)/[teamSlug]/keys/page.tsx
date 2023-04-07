import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/prisma/db";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { DeleteChannelButton } from "../[channelName]/deleteChannelButton";
import { NavLink } from "../[channelName]/nav-link";
import { CreateKeyButton } from "./create-key";
import { DeleteKeyButton } from "./delete-key";

export default async function Page(props: { params: { teamSlug: string } }) {
  const team = await db.team.findUnique({
    where: {
      slug: props.params.teamSlug,
    },
    include: {
      apikeys: true,
    },
  });
  if (!team) {
    return notFound();
  }

  return (
    <div className="">
      <PageHeader
        title={team.name}
        description="API Keys"
        actions={[<CreateKeyButton teamId={team.id} />]}
      />
      <ul role="list" className="space-y-4">
        {team.apikeys.map((key) => (
          <li
            key={key.id}
            className="flex items-center justify-between p-4 border rounded border-neutral-200"
          >
            <div>
              <span className="px-2 py-1 font-mono text-sm border rounded  bg-neutral-50 border-neutral-200 min-w-max">
                api_XXXXXXXXXXXX{key.lastCharacters}
              </span>
              <p className="mx-1 mt-2 text-xs text-neutral-500">
                Created on{" "}
                <time dateTime={key.createdAt.toISOString()}>{key.createdAt.toUTCString()}</time>
              </p>
            </div>
            <DeleteKeyButton keyId={key.id} />

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
    </div>
  );
}
