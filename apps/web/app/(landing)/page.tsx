import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Cta } from "@/components/landing/cta";

export default function Page() {
  return (
    <div className="overflow-x-hidden max-w-screen">
      <Hero />
      <Features />
      <Pricing />
      <Cta />
    </div>
  );
}
