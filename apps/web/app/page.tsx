import HeroSection from './sections/home/hero-section';
import MarqueeSection from './sections/home/marquee-section';
import StatsSection from './sections/home/stats-section';
import FeaturesSection from './sections/home/features-section';
import HowItWorksSection from './sections/home/how-it-works-section';
import TestimonialsSection from './sections/home/testimonials-section';
import CtaSection from './sections/home/cta-section';

export default function Page() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
