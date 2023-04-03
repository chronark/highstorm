import Link from "next/link"
import { ArrowLeft, Check, DollarSign, Menu, X, User, Server, Speaker, Bug, Code, Network, ArrowUp, BellRing, BookOpen, MessageCircle, Send } from "lucide-react"
import Image from "next/image"

import ReactWrapBalancer from "react-wrap-balancer"


const features = [
  {
    name: 'Simple Ingest API',
    description: 'All you need is a simple HTTP POST request to send events to Highstorm.',
    icon: Send,
  },
  {
    name: 'API first',
    description: 'Highstorm offers access to everything via API to allow for maximum flexibility.',
    icon: Code,
  },
  {
    name: 'Built for developers',
    description: 'Built by developers for developers. Highstorm is designed to be easy to use and integrate with.',
    icon: Server,
  },
  {
    name: 'Open Source',
    description: 'Highstorm is open source and free to self host.',
    icon: BookOpen,
  },
  {
    name: 'Alerts',
    description: 'Get notified by email, slack or webhook for important events.',
    icon: BellRing,
  },
  {
    name: 'Generour free tier',
    description: "Highstorm's free tier is generous and allows you to send up to X events per month",
    icon: ArrowUp,
  },
]
export default function Example() {
  return (
    <div className="bg-white">
      {/* Header */}

      <main className="isolate">
        {/* Hero section */}
        <div className="relative pt-14">
          <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="font-bold tracking-tight text-neutral-900  font-display flex flex-col items-center">
                  <span className="whitespace-nowrap text-4xl sm:text-5xl">
                    Open Source
                  </span>
                  <span className="whitespace-nowrap text-4xl sm:text-8xl">
                    Event Monitoring
                  </span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-neutral-600">
                  Tired of setting up a new slack channel for every event?
                  <br />
                  We&apos;ve got you covered.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    href="/auth/sign-in"
                    className="rounded-md bg-neutral-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="https://github.com/chronark/highstorm"
                    className="text-sm font-semibold leading-6 text-neutral-900"
                  >
                    Star on GitHub <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>


        </div>
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="text-base font-semibold leading-7 text-emerald-400">Ingest Everything</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                <ReactWrapBalancer>

                  Analytics At Your Fingertips
                </ReactWrapBalancer>
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {/* Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste
            dolor cupiditate blanditiis. */}
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden pt-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Image
                src="/analytics.png"
                alt="App screenshot"
                className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
                width={2432}
                height={1442}
              />
              <div className="relative" aria-hidden="true">
                <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
              </div>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
            <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <feature.icon className="absolute left-1 top-1 h-5 w-5 text-emerald-500" aria-hidden="true" />
                    {feature.name}
                  </dt>{' '}
                  <dd className="inline">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>


      </main>

      <footer className="bg-white">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">

          <p className="mt-10 text-center text-xs leading-5 text-neutral-500">
            Built by <Link href="https://twitter.com/chronark_" className="hover:text-neutral-800">@chronark_</Link>
          </p>
        </div>
      </footer>

    </div>
  )
}
