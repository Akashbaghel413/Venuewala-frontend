import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedSection from '../components/home/FeaturedSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import StatsSection from '../components/home/StatsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import PartnerCtaSection from '../components/home/PartnerCtaSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <PartnerCtaSection />
    </>
  );
}
