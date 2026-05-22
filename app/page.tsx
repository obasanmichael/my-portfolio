import dynamic from "next/dynamic";
import { Suspense } from "react";

import Hero from "@/components/Hero";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { navItems } from "@/data";

const Grid = dynamic(() => import("@/components/Grid"));
const RecentProjects = dynamic(() => import("@/components/RecentProjects"));
const Experience = dynamic(() => import("@/components/Experience"));
const Approach = dynamic(() => import("@/components/Approach"));
const Footer = dynamic(() => import("@/components/Footer"));

function SectionFallback() {
  return (
    <div className="flex w-full items-center justify-center py-20">
      <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-x-hidden mx-auto sm:px-10 px-5">
      <ScrollToTop />
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <Grid />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <RecentProjects />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Approach />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </div>
    </main>
  );
}
