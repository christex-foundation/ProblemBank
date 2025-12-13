'use client';
import { memo } from 'react';

const TimelineSection = memo(function TimelineSection() {
  const phases = [
    {
      title: 'Application Period',
      date: 'Sept 1 – Oct 14, 2025',
      description: 'Submit your application online with track selection and idea summary',
      icon: '📝',
      color: '#fffaf3',
    },
    {
      title: 'Shortlisting & Notifications',
      date: 'Oct 1 – Oct 10, 2025',
      description: 'Applications reviewed and shortlisted candidates notified',
      icon: '🔍',
      color: '#f2e8dc',
    },
    {
      title: 'Bootcamp',
      date: 'Oct 27 – Nov 5, 2025',
      description: '10-day immersive training in Freetown with technical workshops and mentorship',
      icon: '🎓',
      color: '#fffaf3',
    },
    {
      title: 'Development Phase',
      date: 'Nov 6 – Dec 2, 2025',
      description: 'Build your solution with ongoing support and guidance from mentors',
      icon: '💻',
      color: '#f2e8dc',
    },
    {
      title: 'Final Hackathon',
      date: 'Dec 5 – 8, 2025',
      description: '48-hour non-stop event to finalize projects and pitch to judges',
      icon: '🚀',
      color: '#fffaf3',
    },
    {
      title: 'Review in Progress',
      date: 'Dec 8 – 17, 2025',
      description: 'Our team reviews all submissions and selects winners',
      icon: '🔍',
      color: '#f2e8dc',
    },
  ];

  return (
    <section className="relative z-30 w-full py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#f9f2e9' }}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Heading */}
        <div className="relative flex flex-col items-center text-center select-none mb-12">
          <div className="text-5xl md:text-6xl lg:text-7xl uppercase leading-none">
            <span style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#403f3e', display: 'block', transform: 'rotate(-2deg)' }}>
              EVENT
            </span>
          </div>
          <div className="text-5xl md:text-6xl lg:text-7xl uppercase leading-none mb-6">
            <span style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#403f3e', display: 'block', transform: 'rotate(1.5deg)' }}>
              TIMELINE
            </span>
          </div>
        </div>

        {/* Timeline Cards */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line - Hidden on mobile, shown on larger screens */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#e8ddd0] transform -translate-x-1/2" />

          {phases.map((phase, idx) => (
            <div
              key={phase.title}
              className={`relative mb-12 md:mb-16 ${
                idx % 2 === 0 ? 'md:pr-[calc(50%+2rem)]' : 'md:pl-[calc(50%+2rem)]'
              }`}
            >
              {/* Timeline Dot - Hidden on mobile */}
              <div
                className="hidden md:block absolute top-8 w-4 h-4 bg-[#E6B800] rounded-full border-4 border-[#f9f2e9]"
                style={{
                  [idx % 2 === 0 ? 'right' : 'left']: 'calc(50% - 0.5rem)',
                }}
              />

              {/* Card */}
              <div
                className="relative border border-[#e8ddd0] shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#d8cdbc] overflow-hidden rounded-[28px] p-6 md:p-8"
                style={{
                  backgroundColor: phase.color,
                  transform: `rotate(${idx % 2 === 0 ? -1.5 : 1.5}deg)`,
                }}
              >
                {/* Noise overlay */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
                    backgroundSize: '200px 200px',
                    backgroundRepeat: 'repeat',
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="text-4xl md:text-5xl mb-4">{phase.icon}</div>

                  {/* Title */}
                  <h3
                    className="text-2xl md:text-3xl mb-2"
                    style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#403f3e' }}
                  >
                    {phase.title}
                  </h3>

                  {/* Date */}
                  <p
                    className="text-sm md:text-base mb-3"
                    style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, color: '#E6B800' }}
                  >
                    {phase.date}
                  </p>

                  {/* Description */}
                  <p
                    className="text-base md:text-lg"
                    style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
                  >
                    {phase.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default TimelineSection;
