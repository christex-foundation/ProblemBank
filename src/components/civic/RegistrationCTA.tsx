'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const CivicRegistrationModal = dynamic(() => import('./CivicRegistrationModal'), {
  ssr: false,
});

export default function RegistrationCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="register" className="relative w-full py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        {/* Heading */}
        <h2
          className="text-center mb-12"
          style={{
            fontFamily: 'Decoy, sans-serif',
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 500,
            color: '#1e1e1e',
            transform: 'rotate(-1.5deg)',
          }}
        >
          REGISTER NOW
        </h2>

        <p
          className="text-center text-lg mb-16 max-w-2xl mx-auto"
          style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e', lineHeight: '1.8' }}
        >
          Secure your spot at the Civic Youth Innovation Hackathon and be part of the movement transforming Sierra Leone
          through the Six Civic Pillars.
        </p>

        {/* CTA Card */}
        <div
          className="border-2 border-[#1e1e1e] rounded-[28px] p-12 md:p-16 text-center"
          style={{ transform: 'rotate(-0.5deg)', backgroundColor: '#fffaf3' }}
        >
          <div
            className="absolute inset-0 opacity-5 pointer-events-none rounded-[28px]"
            style={{
              backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          />

          <div className="relative z-10">
            <p
              className="text-xl mb-8"
              style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, color: '#403f3e' }}
            >
              Ready to make an impact on Sierra Leone&apos;s future?
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative overflow-hidden inline-block px-12 py-5 rounded-full bg-[#E6B800] border-2 border-[#1e1e1e] text-[#1e1e1e] font-medium text-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
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
                Complete Registration Form →
              </span>
            </button>

            <p
              className="text-sm mt-6 text-gray-600"
              style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}
            >
              Registration takes less than 5 minutes
            </p>
          </div>
        </div>

      </div>

      {/* Registration Modal */}
      <CivicRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
