import { HighlighterItem, HighlightGroup } from "./highlighter";
import Link from "next/link";
import { Particles } from "./particles";
import { ArrowRight, Check } from "lucide-react";
import { useCallback, useId, useMemo } from "react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: 0,
    description: "Free forever, for teams just getting started",
    features: ["10k Events per month", "1 Alert"],
    cta: "Get Started for Free",
  },
  {
    name: "Pro",
    price: 20,
    description: "For larger teams with increased usage",
    features: ["50k Events per month", "10 Alerts"],
    cta: "Try Pro for 14 days",
  },
  {
    name: "Enterprise",
    price: 50,
    description: "For businesses with custom needs",
    features: ["500k Events per month", "Unlimited Alerts"],
    cta: "Scale Up",
  },
];

const _useColor = (hash: string): [number, number, number] => {
  return useMemo(
    () => [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ],
    [hash],
  );
};

export const Pricing: React.FC = () => {
  return (
    <section className="relative">
      {/* Radial gradient */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
        aria-hidden="true"
      >
        <div className="absolute flex items-center justify-center top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1/3 aspect-square">
          <div className="absolute inset-0 translate-z-0 bg-primary-500 rounded-full blur-[120px] opacity-50" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Content */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <div>
              <div className="inline-flex font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-200 pb-3">
                Pricing plans
              </div>
            </div>
            <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60 pb-4">
              Simple and transparent
            </h2>
            <p className="text-lg text-zinc-400">
              Invite your whole team, we don't do seat based pricing here.
            </p>
          </div>
          {/* Pricing tabs */}
          <HighlightGroup className="grid gap-6 md:grid-cols-12 group h-full">
            {/* Box #1 */}

            {tiers.map((tier, i) => (
              <div
                key={tier.name}
                className="md:col-span-6 h-full  lg:col-span-4  group/item"
                data-aos="fade-down"
              >
                <HighlighterItem>
                  <div className="relative h-full bg-zinc-900 rounded-[inherit] z-20 overflow-hidden">
                    <Particles
                      className="absolute inset-0 -z-10 opacity-10 group-hover/item:opacity-100 transition-opacity duration-1000 ease-in-out"
                      quantity={(i + 1) ** 3 * 10}
                      color={["#34d399", "#fde047", "#f43f5e"][i]}
                    />
                    <div className="flex flex-col">
                      {/* Radial gradient */}
                      <div
                        className="absolute bottom-0 w-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none left-1/2 -z-10 aspect-square"
                        aria-hidden="true"
                      >
                        <div className="absolute inset-0 translate-z-0 bg-zinc-800 rounded-full blur-[80px]" />
                      </div>
                      {/* Text */}

                      <div className="p-8">
                        <h3 id={tier.name} className="text-lg font-semibold leading-8">
                          {tier.name}
                        </h3>

                        <h3 className="mt-6 inline-flex items-baseline pb-1 font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200/60 via-zinc-200 to-zinc-200/60">
                          <span className="text-4xl">${tier.price}</span>
                          <span className="text-lg">/ month</span>
                        </h3>
                        <p className="mt-4 text-sm leading-6 text-zinc-400">{tier.description}</p>
                        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-zinc-300">
                          {tier.features.map((feature) => (
                            <li key={feature} className="flex gap-x-3">
                              <Check
                                className={cn("h-6 w-5 flex-none", {
                                  "text-emerald-400": i === 0,
                                  "text-yellow-300": i === 1,
                                  "text-rose-500": i === 2,
                                })}
                                aria-hidden="true"
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Link
                          className="mt-16 w-full justify-center flex items-center whitespace-nowrap transition duration-150 ease-in-out font-medium rounded px-4 py-1.5  text-zinc-900 bg-gradient-to-r from-white/80 via-white to-white/80 hover:bg-white group"
                          href="/home"
                        >
                          Get Started{" "}
                          <ArrowRight className="w-3 h-3 tracking-normal text-primary-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </HighlighterItem>
              </div>
            ))}
            <div className="md:col-span-6 h-full lg:col-span-12   group/item" data-aos="fade-down">
              <HighlighterItem>
                <div className="relative h-full bg-zinc-900 rounded-[inherit] z-20 overflow-hidden">
                  <Particles
                    className="absolute inset-0 -z-10 opacity-10 group-hover/item:opacity-100 transition-opacity duration-1000 ease-in-out"
                    quantity={200}
                  />
                  <div className="flex flex-col">
                    {/* Radial gradient */}
                    <div
                      className="absolute bottom-0 w-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none left-1/2 -z-10 aspect-square"
                      aria-hidden="true"
                    >
                      <div className="absolute inset-0 translate-z-0 bg-zinc-800 rounded-full blur-[80px]" />
                    </div>
                    {/* Text */}

                    <div className="p-8">
                      <h3 className="text-lg font-semibold leading-8">Self Hosted</h3>

                      <p className="mt-4 text-sm leading-6 text-zinc-400">
                        Self host and maintain Highstorm on your own servers
                      </p>
                      <div className="mt-16  ">
                        <Link
                          className=" whitespace-nowrap transition duration-150 ease-in-out font-medium  text-zinc-100 hover:text-white  group"
                          href="https://github.com/chronark/highstorm"
                        >
                          Deploy your own
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </HighlighterItem>
            </div>
          </HighlightGroup>
        </div>
      </div>
    </section>
  );
};
