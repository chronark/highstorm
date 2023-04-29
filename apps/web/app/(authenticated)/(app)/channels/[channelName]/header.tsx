import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";

type Props = {
  channel: {
    name: string;
  };
  stats?: {
    label: string;
    value: string;
    unit?: string;
  }[];

  actions?: React.ReactNode[];
};

export const Header: React.FC<Props> = ({ channel, stats, actions }) => {
  return (
    <header className="h-32">
      {/* Secondary navigation */}

      <Navbar channelName={channel.name} />

      {/* Heading */}
      <div className="flex h-16   bg-primary-900   justify-between gap-x-8 gap-y-4  px-4 py-4 flex-row items-center sm:px-6 lg:px-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-x-3 ">
            {/* <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                <div className="h-2 w-2 rounded-full bg-current" />
              </div> */}
            <h1 className="flex gap-x-2 text-base leading-7">
              {/* {user.orgSlug} */}
              <span className="font-semibold  text-white">{channel.name}</span>
              {/* {channel.name.split(".").map((part, i) => (
                <>
                  {i !== 0 ? <span className="text-zinc-600">/</span> : null}
                  <span className="font-semibold text-white">{part}</span>
                </>
              ))} */}
            </h1>
          </div>
          {/* <p className="mt-2 text-xs leading-6 text-zinc-400">{channel.description}</p> */}
        </div>
        <div className="flex items-center gap-2 lg:gap-4">{actions}</div>
      </div>
      {stats ? (
        <div
          className={cn(
            "grid grid-cols-1  bg-zinc-700/10 sm:grid-cols-2  border-b border-white/10 h-32",
            {
              "lg:grid-cols-2": stats.length === 2,
              "lg:grid-cols-3": stats.length === 3,
              "lg:grid-cols-4": stats.length >= 4,
            },
          )}
        >
          {stats.map((stat, statIdx) => (
            <div
              key={stat.label}
              className={cn(
                statIdx % 2 === 1 ? "sm:border-l" : statIdx === 2 ? "lg:border-l" : "",
                "border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8",
              )}
            >
              <p className="text-sm font-medium leading-6 text-zinc-400">{stat.label}</p>
              <p className="mt-2 flex items-baseline gap-x-2">
                <span className="text-4xl font-semibold tracking-tight text-white">
                  {stat.value}
                </span>
                {stat.unit ? <span className="text-sm text-zinc-400">{stat.unit}</span> : null}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </header>
  );
};
