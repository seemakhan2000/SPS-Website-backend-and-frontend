// app/page.tsx
import Hero from '@/components/home/Hero';
import AboutUs from '@/components/home/AboutUs';
import ServicesOverview from "@/components/home/ServicesOverview";
import Startups from '@/components/home/Startups';
import Products from '@/components/home/Products';
import ContactCTA from '@/components/home/ContactCTA';
import Customers from "@/components/home/Customers";
import HowItWorks from '@/components/home/HowItWorks';
import TechnologyPartners from '@/components/home/TechnologyPartners'; 
import Highlights from "@/components/home/Highlights";
import ClientsMarquee from "@/components/home/ClientsMarquee";
import NewsInsights from "@/components/home/NewsInsights";
import VerticalsOverview from "@/components/home/VerticalsOverview";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutUs />
       <ServicesOverview />
       <Startups />
       <Products/>
       <ContactCTA />
        <Customers />
        <HowItWorks />
        <TechnologyPartners /> 
        <Highlights />
        <ClientsMarquee/>
        <NewsInsights />
       <VerticalsOverview />
    </main>
  );
}