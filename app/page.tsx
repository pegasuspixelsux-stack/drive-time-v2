import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { WhyChooseUs } from "@/components/why-choose-us";
import { FinanceTabs } from "@/components/finance-tabs";
import { CarGrid } from "@/components/car-grid";
import { PreFooterHero } from "@/components/pre-footer-hero";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />

        <CarGrid />
        <WhyChooseUs />
        <FinanceTabs />
        <PreFooterHero />
      </main>
      <Footer />
    </>
  );
}
