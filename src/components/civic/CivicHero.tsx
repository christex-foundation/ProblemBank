'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const CivicRegistrationModal = dynamic(() => import('./CivicRegistrationModal'), {
  ssr: false,
});

export default function CivicHero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2025-12-11T09:00:00Z'); // Customize event date

    const updateCountdown = () => {
      const now = new Date();
      const diff = Math.max(0, targetDate.getTime() - now.getTime());

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-8 pt-32 pb-20">
      {/* Event Badge */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-4 rounded-full border-2 border-[#1e1e1e] bg-[#1e1e1e] px-8 py-4">
          <Image
            src="/images/Festival Logo.png"
            alt="Festival Logo"
            width={60}
            height={60}
            className="inline-block"
            priority
            quality={90}
          />
          <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, color: '#ffffff' }}>
            CIVIC INNOVATION EVENT
          </span>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-center mb-8">
        <div
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none"
          style={{
            fontFamily: 'Decoy, sans-serif',
            fontWeight: 500,
            color: '#1e1e1e',
            transform: 'rotate(-2deg)',
            display: 'block',
          }}
        >
          CIVIC YOUTH
        </div>
        <div
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none"
          style={{
            fontFamily: 'Decoy, sans-serif',
            fontWeight: 500,
            color: '#1e1e1e',
            transform: 'rotate(1.5deg)',
            display: 'block',
          }}
        >
          INNOVATION
        </div>
        <div
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none"
          style={{
            fontFamily: 'Decoy, sans-serif',
            fontWeight: 500,
            color: '#1e1e1e',
            transform: 'rotate(-1deg)',
            display: 'block',
          }}
        >
          HACKATHON
        </div>
      </h1>

      {/* Subtitle */}
      <p
        className="text-xl md:text-2xl text-center max-w-3xl mb-12"
        style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
      >
        National Civic Festival — Empowering Youth to Shape Sierra Leone&apos;s Future
      </p>

      {/* Event Details Card */}
      <div
        className="w-full max-w-2xl border-2 border-[#1e1e1e] rounded-[28px] md:rounded-[38px] p-8 md:p-12 mb-12"
        style={{ transform: 'rotate(-1deg)', backgroundColor: '#513f2a' }}
      >
        {/* Speckled texture overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none rounded-[28px] md:rounded-[38px]"
          style={{
            backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        <div className="relative z-10">
          {/* Date & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="15" rx="2" stroke="white" strokeWidth="2"/>
                  <path d="M3 10H21" stroke="white" strokeWidth="2"/>
                  <path d="M8 3V7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 3V7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#ffffff',
                    opacity: 0.8,
                  }}
                >
                  Date
                </span>
              </div>
              <p style={{ fontFamily: 'Decoy, sans-serif', fontSize: '28px', fontWeight: 500, color: '#ffffff', lineHeight: 1.2 }}>
                December 11-13, 2025
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21C16.4183 21 20 17.4183 20 13C20 8.58172 16.4183 5 12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21Z" stroke="white" strokeWidth="2"/>
                  <path d="M12 9V13L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#ffffff',
                    opacity: 0.8,
                  }}
                >
                  Location
                </span>
              </div>
              <p style={{ fontFamily: 'Decoy, sans-serif', fontSize: '28px', fontWeight: 500, color: '#ffffff', lineHeight: 1.2 }}>
                Miatta Conference Center
              </p>
              <p style={{ fontFamily: 'Raleway, sans-serif', fontSize: '14px', fontWeight: 600, color: '#ffffff', opacity: 0.7, marginTop: '4px' }}>
                Freetown, Sierra Leone
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="border-t-2 border-white/20 pt-6">
            <p
              className="text-center mb-4"
              style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, fontSize: '14px', color: '#ffffff' }}
            >
              EVENT STARTS IN
            </p>
            <div className="flex justify-center gap-4 md:gap-8">
              {(['Days', 'Hours', 'Minutes', 'Seconds'] as const).map((unit, i) => {
                const value = [countdown.days, countdown.hours, countdown.minutes, countdown.seconds][i];
                return (
                  <div key={unit} className="text-center">
                    <div
                      className="text-3xl md:text-5xl mb-1"
                      style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#ffffff' }}
                    >
                      {String(value).padStart(2, '0')}
                    </div>
                    <div
                      className="text-xs md:text-sm"
                      style={{ fontFamily: 'Raleway, sans-serif', color: '#ffffff', opacity: 0.6 }}
                    >
                      {unit}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative overflow-hidden w-full px-8 py-4 rounded-full bg-[#E6B800] border-2 border-[#1e1e1e] text-[#1e1e1e] font-medium text-lg text-center transition-all duration-300 hover:scale-105"
        >
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          />
          <div className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 rounded-full" />
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
            Register Now
          </span>
        </button>

        {/* <a
          href="/"
          className="group relative overflow-hidden w-full px-8 py-4 rounded-full bg-transparent border-2 border-gray-400 text-gray-700 font-medium text-lg text-center transition-all duration-300 hover:scale-105"
        >
          <div
            className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{
              backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          />
          <div className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 rounded-full" />
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
            View Ideas
          </span>
        </a> */}
      </div>

      {/* Registration Modal */}
      <CivicRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
