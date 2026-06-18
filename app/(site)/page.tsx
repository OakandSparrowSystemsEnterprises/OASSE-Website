import { Hero } from "@/components/Hero";
import { ProblemSection } from "@/components/ProblemSection";
import { WhatWeDo } from "@/components/WhatWeDo";
import { GovernedAssistant } from "@/components/GovernedAssistant";
import { Architecture } from "@/components/Architecture";
import { WhyNow } from "@/components/WhyNow";
import { Engagement } from "@/components/Engagement";
import { Onboarding } from "@/components/Onboarding";
import { WhoItsFor } from "@/components/WhoItsFor";
import { BuiltInTheOpen } from "@/components/BuiltInTheOpen";

// Page order is locked by the master spec, section 6.
export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <WhatWeDo />
      <GovernedAssistant />
      <Architecture />
      <WhyNow />
      <Engagement />
      <BuiltInTheOpen />
      <Onboarding />
      <WhoItsFor />
    </>
  );
}
