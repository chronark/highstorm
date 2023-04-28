import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Features02 } from "@/components/landing/features-02";
import { Pricing } from "@/components/landing/pricing";
import { Cta } from "@/components/landing/cta";

export default function Page() {
  return (
    <div className="max-w-screen overflow-x-hidden">
      <Hero />
      <Features />
      <Features02 />
      <Pricing />
      <Cta />
    </div>
  );
}
