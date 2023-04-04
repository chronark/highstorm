import { db } from "@/prisma/db";




export default async function Page(props: { params: { teamSlug: string; } }) {
    const apiKeys = await db.apiKey.findMany({
        where: {
            team: {
                slug: props.params.teamSlug
            }
        }
    })

    return (
        <div className="">
            <ul role="list" className="space-y-4">
                {apiKeys.map((key) => (
                    <li key={key.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded">

                        <div>
                            <span>{key.name}</span>
                            <pre className="mt-2 bg-neutral-100 rounded-lg font-mono px-2 py-1 text-xs">api_XXX{key.lastCharacters}</pre>
                        </div>
                        <div>
                            <p className="text-neutral-500 text-sm">
                                Created on <time dateTime={key.createdAt.toISOString()}>{key.createdAt.toUTCString()}</time>

                            </p>
                        </div>
                        {/* ">
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="truncate text-sm font-medium text-emerald-600">{key.name}</p>
                                   
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <pre className="flex items-center text-sm text-gray-500">
                                        api_XXXX{key.lastCharacters}
                                        </pre>

                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
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
    )
}