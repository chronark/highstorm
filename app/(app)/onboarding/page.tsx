import { currentUser } from "@clerk/nextjs/app-beta";
import { db } from "@/prisma/db";
import { redirect } from "next/navigation";
import { useId } from "react";
import { CreateTeam } from "./create-team";

export default async function OnboardingPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return redirect("/auth/sign-in");
  }

  const user = await db.user.upsert({
    where: { id: clerkUser.id },
    update: {
      name: clerkUser.username!,
      email: clerkUser.emailAddresses[0]!.emailAddress,
    },
    create: {
      id: clerkUser.id,
      name: clerkUser.username!,
      email: clerkUser.emailAddresses[0]!.emailAddress,
    },
  });

  return (
    <div
      className="relative w-screen bg-white lg:h-screen bg-gradient-radial from-zinc-100 to-transparent"
      style={{ minHeight: "50vh" }}
    >
      {" "}
      <Rings />
      <div className="relative h-full max-w-6xl px-4 mx-auto sm:px-6 ">
        <div className="h-full pt-32 md:pt-40">
          <div className="flex flex-col items-center justify-center text-center h-2/3">
            <h1 className="container text-center font-extrabold tracking-[-0.02em] py-4  text-6xl lg:text-8xl   text-transparent bg-clip-text bg-gradient-to-tr from-zinc-900 to-zinc-900/90">
              Welcome to Bivrost
            </h1>
            <p className="container mt-6 text-lg font-light text-zinc-700">
              Let&apos;s get you set up. This will only take a second.
            </p>

            <div className="flex flex-col justify-center w-full mx-auto mt-8 gap-4 sm:flex-row sm:max-w-lg ">
              <CreateTeam user={{ id: user.id, name: user.name }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Rings: React.FC = (): JSX.Element => {
  const id = useId();

  return (
    <div className=" absolute left-1/2  h-2/3 scale-150  stroke-zinc-700/70 [mask-image:linear-gradient(to_top,white_20%,transparent_75%)] -translate-x-1/2">
      {/* Outer ring */}

      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="inset-0 w-full h-full animate-spin-forward-slow"
      >
        <path
          d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
          stroke="#d4d4d8"
          strokeOpacity="0.7"
        />
        <path
          d="M513 1025C230.23 1025 1 795.77 1 513"
          stroke={`url(#${id}-gradient-1)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-1`}
            x1="1"
            y1="513"
            x2="1"
            y2="1025"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0000aa" />
            <stop offset={1} stopColor="#121212" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
      {/* Inner ring */}
      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full animate-spin-reverse-slower"
      >
        <path
          d="M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z"
          stroke="#d4d4d8"
          strokeOpacity="0.7"
        />
        <path
          d="M913 513c0 220.914-179.086 400-400 400"
          stroke={`url(#${id}-gradient-2)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-2`}
            x1="913"
            y1="513"
            x2="913"
            y2="913"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0000aa" />
            <stop offset={1} stopColor="#121212" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
