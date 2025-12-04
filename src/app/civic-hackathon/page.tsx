'use client';
import { Navigation } from '../../components';
import CivicHero from '../../components/civic/CivicHero';
import AboutSection from '../../components/civic/AboutSection';
import EventTimeline from '../../components/civic/EventTimeline';
import ChallengeThemes from '../../components/civic/ChallengeThemes';
import PartnersSection from '../../components/civic/PartnersSection';
import RegistrationCTA from '../../components/civic/RegistrationCTA';

export default function CivicHackathonPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f9f2e9]">
      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-20"
        style={{
          backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          mixBlendMode: 'multiply'
        }}
      />

      {/* Navigation */}
      <div className="relative z-50">
        <Navigation logoText="ProblemBank" />
      </div>

      {/* Hero Section */}
      <CivicHero />

      {/* About Section */}
      <AboutSection />

      {/* Event Timeline */}
      <EventTimeline />

      {/* Challenge Themes */}
      <ChallengeThemes />

      {/* Partners Section */}
      <PartnersSection />

      {/* Registration CTA */}
      <RegistrationCTA />
    </div>
  );
}
