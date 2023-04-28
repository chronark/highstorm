import Image from "next/image";
import GlowTop from "@/public/images/glow-top.svg";
import { AlertTriangle, GitMerge, LayoutDashboard, Settings } from "lucide-react";

export const Features: React.FC = () => {
  const features = [
    {
      icon: GitMerge,
      name: "Consolidate Events",
      description: "Get all your event data in one place to reduce alert noise",
    },
    {
      icon: AlertTriangle,
      name: "Stay Focused",
      description: "Keep your Slack workspace focused on what's important",
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
  ];
  return (
    <section>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className="absolute inset-0 -z-10 -mx-28 rounded-t-[3rem] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 -translate-x-1/2 top-0 -z-10">
            <Image
              src={GlowTop}
              className="max-w-none"
              width={1404}
              height={658}
              alt="Features Illustration"
            />
          </div>
        </div>

        <div className="pt-16 pb-12 md:pt-52 md:pb-20">
          <div>
            {/* Section content */}
            <div className="max-w-xl mx-auto md:max-w-none flex flex-col md:flex-row md:space-x-8 lg:space-x-16 xl:space-x-20 space-y-8 space-y-reverse md:space-y-0">
              {/* Content */}
              <div
                className="md:w-7/12 lg:w-1/2 order-1 md:order-none max-md:text-center"
                data-aos="fade-down"
              >
                {/* Content #1 */}
                <div>
                  <div className="inline-flex font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-200 pb-3">
                    Don't drown in alerts
                  </div>
                </div>
                <h3 className="font-semibold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60 pb-3">
                  Reduce Alert Noise
                </h3>
                <p className="text-lg text-zinc-400 mb-8">
                  Reduce the noise in your Slack workspace by consolidating all your event data into
                  one place, filtering alerts by relevance, and customizing your alert settings to
                  suit your needs.
                </p>
                <dl className="grid max-w-xl grid-cols-1 gap-4 lg:max-w-none">
                  {features.map((feature) => (
                    <div
                      key={feature.name}
                      className="group hover:bg-zinc-100 duration-500 rounded px-2 py-1"
                    >
                      <div className="flex items-center mb-1 space-x-2 ">
                        <feature.icon className="shrink-0 text-zinc-300 w-4 h-4 group-hover:text-zinc-950 duration-500" />
                        <h4 className="font-medium text-zinc-50 group-hover:text-zinc-950 duration-500">
                          {feature.name}
                        </h4>
                      </div>
                      <p className="text-sm text-left text-zinc-400 group-hover:text-zinc-950 duration-500">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex md:w-5/12 lg:w-1/2 max-w-2xl mx-auto mt-16 sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
                <div className="z-10 flex-none max-w-3xl sm:max-w-5xl lg:max-w-none">
                  <Image
                    src="/screenshots/analytics.png"
                    alt="App screenshot"
                    width={2432}
                    height={1442}
                    className="w-[76rem] z-10 rounded-xl border border-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
