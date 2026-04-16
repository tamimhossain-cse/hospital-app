import HeroSection from '../components/home/HeroSection';
import FeatureCards from '../components/home/FeatureCards';
import ServicesSection from '../components/home/ServicesSection';
import AboutSection from '../components/home/AboutSection';
import DoctorsSection from '../components/home/DoctorsSection';
import AppointmentCTA from '../components/home/AppointmentCTA';
import TestimonialsSection from '../components/home/TestimonialsSection';
import BlogSection from '../components/home/BlogSection';
import ContactSection from '../components/home/ContactSection';
import Footer from '../components/home/Footer';

function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeatureCards />
      <ServicesSection />
      <AboutSection />
      <DoctorsSection />
      <AppointmentCTA />
      <TestimonialsSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default Home;
