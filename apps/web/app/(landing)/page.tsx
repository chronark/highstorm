import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Bell,
  BookOpen,
  ChevronRight,
  Code,
  Filter,
  GitMerge,
  LayoutDashboard,
  Search,
  Send,
  Settings,
  Shuffle,
  Siren,
} from "lucide-react";
import ReactWrapBalancer from "react-wrap-balancer";
import { Logo } from "@/components/logo";
import { FeatureSection } from "./FeatureSection";
import { Cta } from "./cta";
import { Pricing } from "./pricing";

export default function Page() {
  return (
    <div className="w-screen overflow-x-hidden bg-gradient-to-tr from-neutral-950 via-neutral-950 to-rose-950">
      {/* Header */}
      <div className="bg-gradient-radial-top from-rose-500/60 ">
        <div className="px-6 pt-10 pb-24 mx-auto max-w-7xl sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="flex-shrink-0 max-w-2xl mx-auto lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <Link
                href="https://github.com/chronark/highstorm"
                className="inline-flex space-x-6 group"
              >
                <span className="px-3 py-1 text-sm font-semibold leading-6 rounded-full text-rose-500 bg-rose-500/10 ring-1 ring-inset ring-rose-500/20">
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
              <ReactWrapBalancer>Slack isn't built for alerts</ReactWrapBalancer>
            </h1>
            <p className="mt-6 text-lg leading-8 whitespace-normal text-neutral-300">
              <ReactWrapBalancer>Keep Your Workspace Focused</ReactWrapBalancer>
            </p>
            <div className="flex items-center mt-10 gap-x-6">
              <Link
                href="/home"
                className="px-8 lg:px-16 rounded-md bg-white hover:bg-rose-500  py-2.5 text-sm font-semibold text-black duration-500  focus-visible:outline "
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
                className="w-[76rem] z-10 rounded-xl bg-white/5 shadow-2xl ring-1 ring-rose-200/10"
              />
            </div>
          </div>
        </div>
      </div>
      <FeatureSection
        Tag={Activity}
        title="Reduce Alert Noise"
        description="Reduce the noise in your Slack workspace by consolidating all your event data into one place, filtering alerts by relevance, and customizing your alert settings to suit your needs."
        features={[
          {
            icon: GitMerge,
            name: "Consolidate Events",
            description: "Get all your event data in one place to reduce alert noise",
          },
          {
            icon: Filter,
            name: "Filter by Relevance",
            description: "Filter alerts by what matters most to you and avoid alert fatigue",
          },
          {
            icon: AlertTriangle,
            name: "Stay Focused",
            description: "Keep your Slack workspace focused on what's important",
          },
          {
            icon: Shuffle,
            name: "Multi-Source Management",
            description: "Easily manage event data across multiple sources",
          },
          {
            icon: Settings,
            name: "Customizable Settings",
            description: "Customize your alert settings to suit your unique needs",
          },
          {
            icon: LayoutDashboard,
            name: "Clear Overview",
            description: "Get a clear overview of all your alerts in one place",
          },
        ]}
      />
      <FeatureSection
        Tag={Code}
        title="Developer First"
        description="Highstorm is built for developers and offers access to everything via API to allow for maximum flexibility"
        features={[
          {
            name: "Simple Ingest API",
            description: "All you need is a simple HTTP POST request to send events to Highstorm.",
            icon: Send,
          },
          {
            name: "API first",
            description:
              "Highstorm offers access to everything via API to allow for maximum flexibility.",
            icon: Code,
          },

          {
            name: "Open Source",
            description: "Highstorm is open source and free to self host.",
            icon: BookOpen,
          },
        ]}
      />
      <FeatureSection
        Tag={Siren}
        title="High Signal Alerts"
        description="Prioritize high-signal events and alerts, get real-time notifications for important events, and customize your alerts to fit your team's unique needs, improving issue resolution times and keeping your team informed and aligned."
        features={[
          {
            icon: Activity,
            name: "Real-Time Notifications",
            description: "Get real-time notifications for important events",
          },
          {
            icon: Search,
            name: "Quick Identification",
            description: "Quickly identify the most important messages in your workspace",
          },
          {
            icon: Bell,
            name: "Customizable Alerts",
            description: "Customize your alerts to fit your team's unique needs",
          },
        ]}
      />
      <Pricing />

      <footer className="pt-24 bg-white sm:pt-56" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="px-6 pb-8 mx-auto max-w-7xl lg:px-8">
          <div className="pt-8 mt-16 border-t border-white/10 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
            <div className="flex space-x-6 md:order-2">
              <Link
                target="_blank"
                href="https://twitter.com/chronark_"
                className="text-gray-500 hover:text-gray-400"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                target="_blank"
                href="https://github.com/chronark/highstorm"
                className="text-gray-500 hover:text-gray-400"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
            <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
              &copy; {new Date().getUTCFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
