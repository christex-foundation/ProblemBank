'use client';
import Image from 'next/image';

export default function PartnersSection() {
  return (
    <section className="relative z-30 w-full py-16 md:py-24 bg-[#121212]">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Heading */}
        <h2
          className="text-center mb-12"
          style={{
            fontFamily: 'Decoy, sans-serif',
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 500,
            color: '#f7efe3',
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
                Organized By
              </span>
            </div>
            <div className="flex justify-center mb-4">
              <Image
                src="/images/mocti-logo.png"
                alt="Ministry of Communication, Technology & Innovation"
                width={100}
                height={100}
                className="rounded-full"
                unoptimized
              />
            </div>
            <p
              className="text-sm"
              style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#f7efe3' }}
            >
              Ministry of Communication,
              <br />
              Technology & Innovation
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
                Supported By
              </span>
            </div>
            <div className="space-y-4">
              <p
                className="text-base"
                style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#f7efe3' }}
              >
                Partner Organization
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: 'Raleway, sans-serif', color: '#f7efe3', opacity: 0.7 }}
              >
                Supporting innovation in Sierra Leone
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
                style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#f7efe3' }}
              >
                Christex Foundation
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: 'Raleway, sans-serif', color: '#f7efe3', opacity: 0.7 }}
              >
                Building the next generation of innovators
              </p>
            </div>
          </div>
        </div>

        {/* Prizes & Resources */}
        <div
          className="border-2 border-[#e8ddd0] rounded-[28px] bg-[#f7efe3] p-8 md:p-12"
          style={{ transform: 'rotate(-0.5deg)' }}
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
            <h3
              className="text-3xl md:text-4xl mb-6 text-center"
              style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
            >
              PRIZES & SUPPORT
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  place: '1st Place',
                  prize: '$5,000',
                  perks: ['Mentorship Program', 'Incubation Support', 'Media Coverage'],
                },
                {
                  place: '2nd Place',
                  prize: '$3,000',
                  perks: ['Mentorship Program', 'Networking Opportunities', 'Media Coverage'],
                },
                {
                  place: '3rd Place',
                  prize: '$2,000',
                  perks: ['Mentorship Program', 'Community Recognition', 'Certificate'],
                },
              ].map((award, idx) => (
                <div
                  key={award.place}
                  className="text-center p-6 border-2 border-[#1e1e1e] rounded-[20px] bg-white"
                  style={{ transform: `rotate(${[-1, 0, 1][idx]}deg)` }}
                >
                  <div
                    className="text-sm mb-2"
                    style={{
                      fontFamily: 'Raleway, sans-serif',
                      fontWeight: 700,
                      color: '#E6B800',
                      textTransform: 'uppercase',
                    }}
                  >
                    {award.place}
                  </div>
                  <div
                    className="text-4xl mb-4"
                    style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
                  >
                    {award.prize}
                  </div>
                  <ul className="space-y-1 text-sm" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    {award.perks.map((perk, i) => (
                      <li key={i} className="flex items-center justify-center gap-2">
                        <span className="text-[#E6B800]">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
