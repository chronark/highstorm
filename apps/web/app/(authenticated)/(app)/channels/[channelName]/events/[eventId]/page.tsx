import { getEvent } from "@/lib/tinybird";
import { Paperclip } from "lucide-react";
import { notFound } from "next/navigation";

export default async function Page(props: { params: { channelName: string; eventId: string } }) {
  const event = (await getEvent({ eventId: props.params.eventId })).data.at(0);

  if (!event) {
    return notFound();
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col items-start justify-between md:flex-row">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold text-white leading-7">{event.event}</h3>
          <p className="max-w-2xl mt-1 text-sm leading-6 text-zinc-400">{event.content}</p>
        </div>
        <div className="px-4 sm:px-0">
          <span className="text-sm  leading-7 text-zinc-300">
            {new Date(event.time).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="mt-6 border-t border-white/10">
        <dl className="divide-y divide-white/10">
          {Object.entries(event.metadata ?? {}).map(([key, value]) => (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium text-white leading-6">{key}</dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-400 sm:col-span-2 sm:mt-0">
                {value as string}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
