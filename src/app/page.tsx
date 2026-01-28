import AboutUs from "@/components/aboutUs/aboutUs";
import Banner from "@/components/banner/banner";
import OfferForm from "@/components/offerForm/offerForm";
import Services from "@/components/services/services";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Banner />
      <Services />
      <AboutUs />
      <OfferForm />
    </main>
  );
}
