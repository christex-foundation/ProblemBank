'use client';
import Image from 'next/image';

export default function ChallengeThemes() {
  const challenges = [
    {
      title: 'Digital Governance',
      description: 'Build tools that increase transparency, efficiency, and citizen engagement in government services.',
      icon: '/images/6708d8d8f169898f7bd83ed0_heart_120.webp',
      examples: ['E-Government Portals', 'Citizen Feedback Systems', 'Public Service Tracking'],
      bg: '#fffaf3',
      rotate: -1.5,
    },
    {
      title: 'Healthcare Access',
      description: 'Create solutions that improve healthcare delivery and access to medical services across Sierra Leone.',
      icon: '/images/6707c6af78a3dd5acec5512e_flower_64.webp',
      examples: ['Telemedicine Platforms', 'Health Records Systems', 'Appointment Scheduling'],
      bg: '#f2e8dc',
      rotate: 1.2,
    },
    {
      title: 'Education & Skills',
      description: 'Develop platforms that enhance learning opportunities and skill development for all citizens.',
      icon: '/images/6707c6b0778d2c6671252c5f_book_64.webp',
      examples: ['Online Learning Platforms', 'Skill Matching Systems', 'Educational Resources'],
      bg: '#fffaf3',
      rotate: -0.8,
    },
    {
      title: 'Economic Empowerment',
      description: 'Design tools that support local businesses, entrepreneurs, and job seekers in Sierra Leone.',
      icon: '/images/6708d8dfbf6d79d76ebd68eb_lightning_120.webp',
      examples: ['Marketplace Platforms', 'Financial Literacy Tools', 'Job Matching Systems'],
      bg: '#f2e8dc',
      rotate: 1.5,
    },
    {
      title: 'Public Safety',
      description: 'Build systems that enhance community safety and emergency response capabilities.',
      icon: '/images/6708d7e1e82809f4e18f8e05_flag_120.webp',
      examples: ['Emergency Alert Systems', 'Crime Reporting Apps', 'Disaster Response Tools'],
      bg: '#fffaf3',
      rotate: -1.2,
    },
    {
      title: 'Environmental Sustainability',
      description: 'Create solutions that promote environmental conservation and sustainable practices.',
      icon: '/images/6707c6aff10ed02bb97c61f9_brilliant_64.webp',
      examples: ['Waste Management Systems', 'Green Energy Tracking', 'Climate Action Tools'],
      bg: '#f2e8dc',
      rotate: 0.9,
    },
  ];

  return (
    <section className="relative z-30 w-full py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-4">
          <h2
            style={{
              fontFamily: 'Decoy, sans-serif',
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: 500,
              color: '#1e1e1e',
              transform: 'rotate(-1.5deg)',
              display: 'inline-block',
            }}
          >
            CHALLENGE TRACKS
          </h2>
        </div>

        <p
          className="text-center text-lg mb-12 max-w-3xl mx-auto"
          style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
        >
          Choose a track that aligns with your passion and skills. Each track focuses on solving real
          problems faced by Sierra Leonean communities.
        </p>

        {/* Challenge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challenges.map((challenge, idx) => (
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
                  className="text-sm leading-relaxed text-center mb-4"
                  style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
                >
                  {challenge.description}
                </p>

                {/* Examples */}
                <div className="mt-auto pt-4 border-t border-gray-300">
                  <p
                    className="text-xs mb-2 text-center"
                    style={{
                      fontFamily: 'Raleway, sans-serif',
                      fontWeight: 700,
                      color: '#E6B800',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Example Projects
                  </p>
                  <ul className="space-y-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    {challenge.examples.map((example, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#E6B800]">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p
            className="text-base"
            style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
          >
            Don't see your idea listed? We welcome innovative solutions to any civic challenge!
          </p>
        </div>
      </div>
    </section>
  );
}
