import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { cars, type Car } from "@/data/cars";
import { carDetails } from "@/data/car-details";
import { CarSlideshow } from "@/components/car-detail/car-slideshow";
import { CarHeaderInfo } from "@/components/car-detail/car-header-info";
import { EditorialDescription } from "@/components/car-detail/editorial-description";
import { FeatureColumns } from "@/components/car-detail/feature-columns";
import { CarInquiryForm } from "@/components/car-detail/car-inquiry-form";
import { SimilarCarsSlider } from "@/components/car-detail/similar-cars-slider";

function getSimilarCars(currentId: string, bodyType: Car["bodyType"]): Car[] {
  const sameBodyType = cars.filter(
    (car) => car.id !== currentId && car.bodyType === bodyType,
  );
  if (sameBodyType.length >= 3) return sameBodyType.slice(0, 6);

  const sameBodyTypeIds = new Set(sameBodyType.map((car) => car.id));
  const others = cars.filter(
    (car) => car.id !== currentId && !sameBodyTypeIds.has(car.id),
  );
  return [...sameBodyType, ...others].slice(0, 6);
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = cars.find((item) => item.id === id);
  const detail = car ? carDetails[car.id] : undefined;

  if (!car || !detail) {
    notFound();
  }

  const similarCars = getSimilarCars(car.id, car.bodyType);

  return (
    <div data-theme="light" className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1 bg-zinc-50 pt-24 sm:pt-28">
        <CarSlideshow images={detail.images} />
        <CarHeaderInfo car={car} />
        <EditorialDescription editorial={detail.editorial} />
        <FeatureColumns features={detail.features} />
        <CarInquiryForm car={car} />
        <SimilarCarsSlider cars={similarCars} />
      </main>
      <Footer />
    </div>
  );
}
