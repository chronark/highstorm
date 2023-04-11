import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  BellRing,
  BookOpen,
  Bug,
  Check,
  ChevronRight,
  Code,
  DollarSign,
  Menu,
  MessageCircle,
  Network,
  Send,
  Server,
  Speaker,
  User,
  X,
} from "lucide-react";
import ReactWrapBalancer from "react-wrap-balancer";
import { Logo } from "@/components/logo";

const features = [
  {
    name: "Simple Ingest API",
    description: "All you need is a simple HTTP POST request to send events to Highstorm.",
    icon: Send,
  },
  {
    name: "API first",
    description: "Highstorm offers access to everything via API to allow for maximum flexibility.",
    icon: Code,
  },
  {
    name: "Built for developers",
    description:
      "Built by developers for developers. Highstorm is designed to be easy to use and integrate with.",
    icon: Server,
  },
  {
    name: "Open Source",
    description: "Highstorm is open source and free to self host.",
    icon: BookOpen,
  },
  {
    name: "Alerts",
    description: "Get notified by email, slack or webhook for important events.",
    icon: BellRing,
  },
  {
    name: "Generour free tier",
    description:
      "Highstorm's free tier is generous and allows you to send up to X events per month",
    icon: ArrowUp,
  },
];
export default function Page() {
  return (
    <div className="bg-gradient-to-b from-amber-950 via-neutral-950 to-neutral-950 ">
      {/* Header */}
      <div className="bg-gradient-radial-top from-amber-500/90 ">
        <div className="px-6 pt-10 pb-24 mx-auto max-w-7xl sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="flex-shrink-0 max-w-2xl mx-auto lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <Link
                href="https://github.com/chronark/highstorm"
                className="inline-flex space-x-6 group"
              >
                <span className="px-3 py-1 text-sm font-semibold leading-6 rounded-full text-amber-400 bg-amber-500/10 ring-1 ring-inset ring-amber-500/20">
                  Open Source
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 duration-500 text-neutral-300 group-hover:text-white">
                  <span>Star on GitHub</span>
                  <ChevronRight
                    className="w-4 h-4 duration-500 text-neutral-500 group-hover:text-white"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Your Slack is too cluttered
            </h1>
            <p className="mt-6 text-lg leading-8 whitespace-normal text-neutral-300">
            Slack isn't built for alerts
            </p>
            <div className="flex items-center mt-10 gap-x-6">
              <Link
                href="/auth/sign-in"
                className="px-8 lg:px-16 rounded-md bg-white hover:bg-amber-500  py-2.5 text-sm font-semibold text-black duration-500  focus-visible:outline "
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="flex max-w-2xl mx-auto mt-16 sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="z-10 flex-none max-w-3xl sm:max-w-5xl lg:max-w-none">
              <Image
                src="/screenshots/analytics.png"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="w-[76rem] z-10 rounded-xl bg-white/5 shadow-2xl ring-1 ring-amber-200/10"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="py-24 sm:py-32">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="max-w-2xl mx-auto sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-amber-400">Ingest Everything</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
              <ReactWrapBalancer>Analytics At Your Fingertips</ReactWrapBalancer>
            </p>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              {/* Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste
            dolor cupiditate blanditiis. */}
            </p>
          </div>
        </div>

        <div className="relative pt-16 overflow-hidden">
          <div className="px-6 mx-auto max-w-7xl lg:px-8">
            <Image
              src="/screenshots/logs.png"
              alt="App screenshot"
              className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-white/10"
              width={2432}
              height={1442}
            />
            <div className="relative" aria-hidden="true">
              <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-neutral-950 pt-[7%]" />
            </div>
          </div>
        </div>
        <div className="px-6 mx-auto mt-16 max-w-7xl sm:mt-20 md:mt-24 lg:px-8">
          <dl className="grid max-w-2xl grid-cols-1 mx-auto text-base leading-7 text-neutral-600 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-9">
                <dt className="inline font-semibold text-neutral-100">
                  <feature.icon
                    className="absolute w-5 h-5 left-1 top-1 text-amber-500"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>{" "}
                <dd className="inline text-neutral-400">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <footer>
        <div className="px-6 py-20 mx-auto overflow-hidden max-w-7xl sm:py-24 lg:px-8">
          <p className="mt-10 text-xs leading-5 text-center text-neutral-500">
            Built by{" "}
            <Link href="https://twitter.com/chronark_" className="hover:text-neutral-800">
              @chronark_
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
