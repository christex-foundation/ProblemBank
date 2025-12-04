'use client';

export default function AboutSection() {
  return (
    <section id="learn-more" className="relative z-30 w-full py-16 md:py-24">
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
          ABOUT THE EVENT
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
                Our Vision
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, color: '#403f3e' }}
              >
                The Salone Civic Hackathon brings together innovators, developers, designers, and civic leaders
                to collaborate on technology solutions that address Sierra Leone's most pressing challenges.
                Together, we're building a more connected, efficient, and inclusive society.
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
                  <span>Software Developers & Engineers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B800] text-xl">✦</span>
                  <span>UI/UX Designers & Creative Professionals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B800] text-xl">✦</span>
                  <span>Data Scientists & Analysts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B800] text-xl">✦</span>
                  <span>Students & Early-Career Professionals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E6B800] text-xl">✦</span>
                  <span>Community Organizers & Civic Leaders</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '48', label: 'Hours of Innovation' },
            { value: '100+', label: 'Participants' },
            { value: '$10K', label: 'In Prizes' },
            { value: '5+', label: 'Challenge Tracks' },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className="text-center p-6 border border-[#e8ddd0] rounded-[20px] bg-white"
              style={{ transform: `rotate(${[-1, 0.5, -0.5, 1][idx]}deg)` }}
            >
              <div
                className="text-4xl md:text-5xl mb-2"
                style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#E6B800' }}
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
