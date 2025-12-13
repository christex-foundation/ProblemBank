'use client';

export default function AboutSection() {
  return (
    <section id="learn-more" className="relative w-full py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Heading */}
        <h2
          className="text-center mb-12 leading-tight"
          style={{
            fontFamily: 'Decoy, sans-serif',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 500,
            color: '#1e1e1e',
            transform: 'rotate(-1.5deg)',
          }}
        >
          <div>ABOUT THE</div>
          <div>EVENT</div>
        </h2>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Vision Card */}
          <div
            className="border-2 border-[#1e1e1e] rounded-[28px] bg-[#fffaf3] p-8"
            style={{ transform: 'rotate(-1deg)' }}
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
                className="text-3xl mb-4"
                style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
              >
                The Challenge
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
              >
                Despite ongoing national reforms, young people—the country&apos;s largest demographic group
                (approximately 70% of the population under age 35)—remain under-engaged in shaping national
                narratives, policies, and solutions. The Civic Youth Innovation Hackathon seeks to address persistent
                civic gaps by enabling youth-driven innovations across the Six Civic Pillars.
              </p>
            </div>
          </div>

          {/* Who Can Join Card */}
          <div
            className="border-2 border-[#1e1e1e] rounded-[28px] bg-[#f2e8dc] p-8"
            style={{ transform: 'rotate(1deg)' }}
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
                className="text-3xl mb-4"
                style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
              >
                Who Can Join
              </h3>
              <ul
                className="space-y-2 text-base"
                style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
              >
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B800] text-xl">✦</span>
                  <span>Young Innovators & Creators</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B800] text-xl">✦</span>
                  <span>Tech Developers & Designers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B800] text-xl">✦</span>
                  <span>Content Creators & Storytellers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B800] text-xl">✦</span>
                  <span>Civic Activists & Community Leaders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B800] text-xl">✦</span>
                  <span>Students & Youth Organizations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '15-30', label: 'Age Range' },
            { value: '6', label: 'Civic Pillars' },
            { value: '$1K', label: 'Prize Pool' },
            { value: '10+', label: 'Ideas Provided' },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-[20px]"
              style={{
                transform: `rotate(${[-1, 0.5, -0.5, 1][idx]}deg)`,
                backgroundColor: '#f2e8dc'
              }}
            >
              <div
                className="text-4xl md:text-5xl mb-2"
                style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
              >
                {stat.value}
              </div>
              <div
                className="text-sm"
                style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 700, color: '#403f3e' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
