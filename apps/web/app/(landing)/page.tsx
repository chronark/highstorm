import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Cta } from "@/components/landing/cta";

export default function Page() {
  return (
    <div className="max-w-screen overflow-x-hidden">
      <Hero />
      <Features />
      <Pricing />
      <Cta />
    </div>
  );
}
