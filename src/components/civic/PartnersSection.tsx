'use client';
import Image from 'next/image';

export default function PartnersSection() {
  return (
    <section className="relative w-full py-16 md:py-24 bg-[#f7efe3]">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
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
          OUR PARTNERS
        </h2>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Organizer */}
          <div className="text-center">
            <div
              className="inline-block px-4 py-2 rounded-full mb-4"
              style={{ backgroundColor: '#E6B800' }}
            >
              <span
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 700,
                  fontSize: '12px',
                  color: '#1e1e1e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Led By
              </span>
            </div>
            <div className="flex justify-center mb-4">
              <Image
                src="/images/mocti-logo.png"
                alt="Ministry of Information and Civic Education"
                width={100}
                height={100}
                className="rounded-full"
                unoptimized
              />
            </div>
            <p
              className="text-sm"
              style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#1e1e1e' }}
            >
              Ministry of Information
              <br />
              and Civic Education (MoICE)
            </p>
          </div>

          {/* Supported By */}
          <div className="text-center">
            <div
              className="inline-block px-4 py-2 rounded-full mb-4"
              style={{ backgroundColor: '#f7efe3' }}
            >
              <span
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 700,
                  fontSize: '12px',
                  color: '#1e1e1e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                In Partnership With
              </span>
            </div>
            <div className="space-y-4">
              <p
                className="text-base"
                style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
              >
                Civic & Development Institutions
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e', opacity: 0.8 }}
              >
                Supporting national civic transformation
              </p>
            </div>
          </div>

          {/* Community Partner */}
          <div className="text-center">
            <div
              className="inline-block px-4 py-2 rounded-full mb-4"
              style={{ backgroundColor: '#f7efe3' }}
            >
              <span
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 700,
                  fontSize: '12px',
                  color: '#1e1e1e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Community Partner
              </span>
            </div>
            <div className="space-y-4">
              <p
                className="text-base"
                style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
              >
                Christex Foundation
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e', opacity: 0.8 }}
              >
                Building the next generation of innovators
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
