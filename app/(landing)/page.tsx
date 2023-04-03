import Link from "next/link"
import { ArrowLeft, Check, DollarSign, Menu, X, User, Server } from "lucide-react"


const features = [
  {
    name: 'User Activity',
    description:
      'Monitor new users and user activity. Get notified when a user signs up or when a customer churns',
    icon: User,
  },
  {
    name: 'Billing Events',
    description: 'Get notified when a customer signs up for a new plan, pays an invoice or cancels their subscription.',
    icon: DollarSign,
  },
  {
    name: 'Deployments',
    description: 'Stay on top of your deployments. Get notified when a new release is deployed to production.',
    icon: Server,
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

          <div className="relative overflow-hidden pt-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <img
                src="app.png"
                alt="App screenshot"
                className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-neutral-900/10"
                width={2432}
                height={1442}
              />
              <div className="relative" aria-hidden="true">
                <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
              </div>
            </div>
          </div>
          <div className="overflow-hidden bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
                <div className="px-6 md:px-0 lg:pr-4 lg:pt-4">
                  <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
                    <h2 className="text-base font-semibold leading-7 text-orange-600">Track Anything</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ingest all your events</p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      You know best what you want to track. We&apos;ll help you get it done.
                    </p>
                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                      {features.map((feature) => (
                        <div key={feature.name} className="relative pl-9">
                          <dt className="inline font-semibold text-gray-900">
                            <feature.icon className="absolute left-1 top-1 h-5 w-5 text-orange-600" aria-hidden="true" />
                            {feature.name}
                          </dt>{' '}
                          <dd className="inline">{feature.description}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                <div className="sm:px-6 lg:px-0">
                  <div className="w-screen overflow-hidden rounded-xl bg-gray-900 ring-1 ring-white/10">
                    <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                      <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                        <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                          curl
                        </div>
                        {/* <div className="border-r border-gray-600/10 px-4 py-2">App.jsx</div> */}
                      </div>
                    </div>
                    <div className="px-6 pb-14 pt-6">{
                      <pre className="font-mono whitespace-pre text-neutral-200 text-left">
                        {`curl https://highstorm.vercel.app/api/v1/events/users.signup' \\
  -H 'Authorization: Bearer api_xxxx' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "event": "Chronark has signed up",
    "content": "userId: user_abcdef123456"
  }'
`}
                      </pre>
                    }</div>
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
                  aria-hidden="true"
                />
              </div>

            </div>
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
