import { useTranslations } from "next-intl";
import Hero from "@/components/home/Hero";
import ServiceTeaser from "@/components/home/ServiceTeaser";
import AboutTeaser from "@/components/home/AboutTeaser";
import DayCareTeaser from "@/components/home/DayCareTeaser";
import ServicesSection from "@/components/home/ServicesSection";
import CareerTeaser from "@/components/home/CareerTeaser";
import ContactSection from "@/components/home/ContactSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <ServiceTeaser />
      <AboutTeaser />
      <ServicesSection />
      <DayCareTeaser />
      <CareerTeaser />
      <ContactSection />
    </div>
  );
}
