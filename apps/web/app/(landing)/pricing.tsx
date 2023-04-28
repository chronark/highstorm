"use client";
import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import ReactWrapBalancer from "react-wrap-balancer";

type Frequency = "monthly" | "annually";
type Tier = "free" | "startup" | "pro";
const pricing: {
  frequencies: { value: Frequency; label: string; priceSuffix: string }[];
  tiers: {
    tier: Tier;
    name: string;
    href: string;
    description: string;
    features: string[];
    cta: string;
    mostPopular?: boolean;
    price?: Record<Frequency, string>;
  }[];
} = {
  frequencies: [
    { value: "monthly", label: "Monthly", priceSuffix: "/month" },
    { value: "annually", label: "Annually", priceSuffix: "/year" },
  ],
  tiers: [
    {
      name: "Startup",
      tier: "startup",
      href: "/home",
      price: { monthly: "$10", annually: "$100" },
      description: "For small teams and startups",
      features: ["50k Events / month"],
      mostPopular: true,
      cta: "Get Started",
    },
    {
      name: "Pro",
      tier: "pro",
      href: "/home",
      price: { monthly: "$50", annually: "$500" },
      description: "For growing teams",
      features: ["1M Events / month"],
      mostPopular: false,
      cta: "Get Started",
    },
  ],
};

export const Pricing: React.FC = () => {
  const [_frequency, _setFrequency] = useState(pricing.frequencies[0]);

  return (
    <div className="">
      <div className="overflow-hidden gradient-to-r from-orange-950/10 via-primary-950/40 to-orange-950/10 isolate">
        <div className="px-6 pt-24 mx-auto text-center max-w-7xl pb-96 sm:pt-32 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-base font-semibold leading-7 text-primary-500">Pricing</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl font-display">
              <ReactWrapBalancer>The right price for any team</ReactWrapBalancer>
            </p>
          </div>
          <div className="relative mt-6">
            <p className="max-w-2xl mx-auto text-lg leading-8 text-white/60">
              Invite your whole team, we don't do seat based pricing here
            </p>
          </div>
        </div>
        <div className="flow-root pb-24 bg-white sm:pb-32">
          <div className="-mt-80">
            <div className="px-6 mx-auto max-w-7xl lg:px-8">
              <div className="grid max-w-md grid-cols-1 gap-8 mx-auto lg:max-w-4xl lg:grid-cols-2">
                {pricing.tiers.map((tier) => (
                  <div
                    key={tier.tier}
                    className="flex flex-col justify-between p-8 bg-white border shadow-lg rounded-xl sm:p-10"
                  >
                    <div>
                      <h3
                        id={tier.tier}
                        className="text-base font-semibold leading-7 text-primary-600"
                      >
                        {tier.name}
                      </h3>
                      <div className="flex items-baseline mt-4 gap-x-2">
                        <span className="text-5xl font-bold tracking-tight text-gray-900">
                          {tier.price?.monthly}
                        </span>
                        <span className="text-base font-semibold leading-7 text-gray-600">
                          /month
                        </span>
                      </div>
                      <p className="mt-6 text-base leading-7 text-gray-600">{tier.description}</p>
                      <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex gap-x-3">
                            <Check
                              className="flex-none w-5 h-6 text-primary-600"
                              aria-hidden="true"
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href={tier.href}
                      aria-describedby={tier.tier}
                      className="mt-8 block rounded-md bg-black px-3.5 py-2 text-center text-sm font-semibold leading-6 ring-inset text-white shadow-sm hover:bg-white ring-1 ring-black hover:text-black duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      Get started today
                    </Link>
                  </div>
                ))}
                <div className="flex flex-col items-start p-8 gap-x-8 gap-y-6 rounded-xl ring-1 ring-gray-900/10 sm:gap-y-10 sm:p-10 lg:col-span-2 lg:flex-row lg:items-center">
                  <div className="lg:min-w-0 lg:flex-1">
                    <h3 className="text-lg font-semibold leading-8 tracking-tight text-zinc-950">
                      Free Tier
                    </h3>
                    <p className="mt-1 text-base leading-7 text-gray-600">
                      Ingest up to 1k events per month for free, no credit card required
                    </p>
                  </div>
                  <Link
                    href="/home"
                    className="rounded-md px-3.5 py-2 text-sm font-semibold leading-6 text-black ring-1 ring-inset ring-black hover:bg-black hover:text-white duration-500  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Sign Up <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
