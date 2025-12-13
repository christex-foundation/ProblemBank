'use client';
import Image from 'next/image';

export default function SixPillarsSection() {
  const pillars = [
    {
      name: 'Love Salone',
      description: 'Develop platforms, content, and tools that empower young creators to produce authentic Sierra Leonean stories that strengthen unity, counter misinformation, and build a renewed sense of national belonging.',
      icon: '/images/6708d8d8f169898f7bd83ed0_heart_120.webp',
    },
    {
      name: 'Feed Salone',
      description: 'Create civic-tech, communication, or community-driven solutions that increase public awareness, strengthen accountability, and boost youth engagement in the Feed Salone initiative.',
      icon: '/images/6707c6af78a3dd5acec5512e_flower_64.webp',
    },
    {
      name: 'Clean Salone',
      description: 'Innovate tools or campaigns that promote environmental accountability, citizen-led waste management, climate awareness, and sustainable community practices.',
      icon: '/images/6707c6aff10ed02bb97c61f9_brilliant_64.webp',
    },
    {
      name: 'Heal Salone',
      description: 'Design culturally appropriate, accurate, and accessible youth-led health innovation tools—ranging from digital platforms to creative media—that strengthen public trust in health systems.',
      icon: '/images/6708d8dfbf6d79d76ebd68eb_lightning_120.webp',
    },
    {
      name: 'Digitise Salone',
      description: 'Create innovative digital solutions that improve access to public information, strengthen citizen–government interaction, enhance digital literacy, and support open governance.',
      icon: '/images/6708d8d83911c95f3000bbfa_star_120.webp',
    },
    {
      name: 'Salone Big Pas We All',
      description: 'Develop tools, campaigns, storytelling platforms, or civic engagement initiatives that promote social cohesion, reduce polarization, and reinforce unity across political, regional, and generational divides.',
      icon: '/images/6708d7e1e82809f4e18f8e05_flag_120.webp',
    },
  ];

  return (
    <section className="relative w-full py-16 md:py-24 bg-black">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Heading */}
        <h2
          className="text-center mb-6 leading-tight"
          style={{
            fontFamily: 'Decoy, sans-serif',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 500,
            color: '#f7efe3',
          }}
        >
          <div>THE SIX</div>
          <div>CIVIC PILLARS</div>
        </h2>

        <p
          className="text-center text-lg mb-12 max-w-3xl mx-auto"
          style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#f7efe3' }}
        >
          Choose one civic pillar and build youth-driven innovations that reinforce national unity,
          strengthen trust in public institutions, and promote shared responsibility for development.
        </p>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.name}
              className="relative border-2 border-[#1e1e1e] rounded-[28px] p-8"
              style={{
                backgroundColor: idx % 2 === 0 ? '#fffaf3' : '#f2e8dc',
                transform: `rotate(${[0.5, -0.5, 0.5, -0.5, 0.5, -0.5][idx]}deg)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-5 pointer-events-none rounded-[28px]"
                style={{
                  backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
                  backgroundSize: '200px 200px',
                  backgroundRepeat: 'repeat',
                }}
              />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-4">
                  <Image
                    src={pillar.icon}
                    alt={pillar.name}
                    width={80}
                    height={80}
                    style={{ display: 'block' }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="text-2xl mb-4"
                  style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
                >
                  {pillar.name}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
                >
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
