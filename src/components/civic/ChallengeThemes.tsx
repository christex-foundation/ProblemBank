'use client';
import Image from 'next/image';

export default function ChallengeThemes() {
  const challenges = [
    {
      title: 'Love Salone',
      description: 'Develop platforms, content, and tools that empower young creators to produce authentic Sierra Leonean stories that strengthen unity, counter misinformation, and build a renewed sense of national belonging.',
      icon: '/images/6708d8d8f169898f7bd83ed0_heart_120.webp',
      examples: ['Cultural Storytelling Platforms', 'Counter-Misinformation Tools', 'Civic Pride Content Creators'],
      bg: '#fffaf3',
      rotate: -1.5,
    },
    {
      title: 'Feed Salone',
      description: 'Create civic-tech, communication, or community-driven solutions that increase public awareness, strengthen accountability, and boost youth engagement in the Feed Salone initiative.',
      icon: '/images/6707c6af78a3dd5acec5512e_flower_64.webp',
      examples: ['Agricultural Extension Apps', 'Market Information Platforms', 'Farmer Feedback Systems'],
      bg: '#f2e8dc',
      rotate: 1.2,
    },
    {
      title: 'Clean Salone',
      description: 'Innovate tools or campaigns that promote environmental accountability, citizen-led waste management, climate awareness, and sustainable community practices.',
      icon: '/images/6707c6aff10ed02bb97c61f9_brilliant_64.webp',
      examples: ['Waste Tracking Apps', 'Community Cleanup Coordinators', 'Climate Action Platforms'],
      bg: '#fffaf3',
      rotate: -0.8,
    },
    {
      title: 'Heal Salone',
      description: 'Design culturally appropriate, accurate, and accessible youth-led health innovation tools—ranging from digital platforms to creative media—that strengthen public trust in health systems.',
      icon: '/images/6708d8dfbf6d79d76ebd68eb_lightning_120.webp',
      examples: ['Health Literacy Platforms', 'Community Health Trackers', 'Vaccine Information Systems'],
      bg: '#f2e8dc',
      rotate: 1.5,
    },
    {
      title: 'Digitise Salone',
      description: 'Create innovative digital solutions that improve access to public information, strengthen citizen–government interaction, enhance digital literacy, and support open governance.',
      icon: '/images/6708d8d83911c95f3000bbfa_star_120.webp',
      examples: ['E-Government Platforms', 'Digital Literacy Apps', 'Civic Transparency Tools'],
      bg: '#fffaf3',
      rotate: -1.2,
    },
    {
      title: 'Salone Big Pas We All',
      description: 'Develop tools, campaigns, storytelling platforms, or civic engagement initiatives that promote social cohesion, reduce polarization, and reinforce unity across political, regional, and generational divides.',
      icon: '/images/6708d7e1e82809f4e18f8e05_flag_120.webp',
      examples: ['Unity Storytelling Platforms', 'Cross-Community Dialogue Tools', 'Peacebuilding Apps'],
      bg: '#f2e8dc',
      rotate: 0.9,
    },
  ];

  return (
    <section className="relative w-full py-16 md:py-24 bg-[#121212]">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-4">
          <h2
            style={{
              fontFamily: 'Decoy, sans-serif',
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: 500,
              color: '#f7efe3',
              transform: 'rotate(-1.5deg)',
              display: 'inline-block',
            }}
          >
            THE SIX CIVIC PILLARS
          </h2>
        </div>

        <p
          className="text-center text-lg mb-12 max-w-3xl mx-auto"
          style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#f7efe3' }}
        >
          Choose one civic pillar and build youth-driven innovations that reinforce national unity,
          strengthen trust in public institutions, and promote shared responsibility for development.
        </p>

        {/* Challenge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challenges.map((challenge) => (
            <div
              key={challenge.title}
              className="relative border-2 border-[#1e1e1e] rounded-[28px] p-8 transition-all duration-300 hover:shadow-xl hover:scale-105"
              style={{
                backgroundColor: challenge.bg,
                transform: `rotate(${challenge.rotate}deg)`,
                height: '100%',
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

              <div className="relative z-10 h-full flex flex-col">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <Image
                    src={challenge.icon}
                    alt={challenge.title}
                    width={64}
                    height={64}
                    style={{ display: 'block' }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="text-2xl mb-3 text-center"
                  style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
                >
                  {challenge.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed text-center"
                  style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
                >
                  {challenge.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
