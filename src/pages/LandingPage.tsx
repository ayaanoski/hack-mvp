import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { CTASection } from '../components/landing/CTASection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="HackMVP - Your AI Hackathon Co-Pilot | Transform Ideas into MVPs"
        description="Transform rough ideas into fully functional MVPs in minutes with AI-powered hackathon co-pilot. Generate tech stacks, pitch decks, video scripts, and deployment-ready code instantly."
        keywords="hackathon, MVP, AI co-pilot, tech stack generator, pitch deck creator, startup tools, rapid prototyping, artificial intelligence, development tools"
      />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
};