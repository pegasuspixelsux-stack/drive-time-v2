import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SearchFilter } from "@/components/search-filter";
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

        <div className="relative z-20 mx-auto -mt-24 mb-20 max-w-7xl px-6 lg:px-8">
          <SearchFilter />
        </div>

        <CarGrid />
        <WhyChooseUs />
        <FinanceTabs />
        <PreFooterHero />
      </main>
      <Footer />
    </>
  );
}
