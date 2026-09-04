import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StackMarquee from "@/components/StackMarquee";
import LanguageGlobe from "@/components/LanguageGlobe";
import WhatIBuildSection from "@/components/WhatIBuildSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import GithubActivity from "@/components/GithubActivity";
import SynapexSection from "@/components/SynapexSection";
import JourneySection from "@/components/JourneySection";
import EducationSection from "@/components/EducationSection";
import CertificationsSection from "@/components/CertificationsSection";
import CurrentlyBuildingSection from "@/components/CurrentlyBuildingSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <StackMarquee />
    <LanguageGlobe />
    <WhatIBuildSection />
    <SkillsSection />
    <ProjectsSection />
    <GithubActivity />
    <SynapexSection />
    <JourneySection />
    <EducationSection />
    <CertificationsSection />
    <CurrentlyBuildingSection />
    <BlogSection />
    <TestimonialsSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
