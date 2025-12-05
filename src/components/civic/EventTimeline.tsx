'use client';

export default function EventTimeline() {
  const timeline = [
    {
      time: 'Day 1 - March 15',
      title: 'Opening & Team Formation',
      items: [
        '9:00 AM - Registration & Welcome Coffee',
        '10:00 AM - Opening Ceremony & Challenge Presentations',
        '12:00 PM - Team Formation & Networking Lunch',
        '2:00 PM - Hacking Begins!',
        '6:00 PM - Mentor Check-ins',
      ],
    },
    {
      time: 'Day 2 - March 16',
      title: 'Build & Iterate',
      items: [
        '9:00 AM - Breakfast & Progress Updates',
        '11:00 AM - Technical Workshops',
        '1:00 PM - Lunch & Networking',
        '3:00 PM - Mentor Office Hours',
        '7:00 PM - Mid-Hackathon Check-in',
      ],
    },
    {
      time: 'Day 3 - March 17',
      title: 'Final Push & Presentations',
      items: [
        '9:00 AM - Final Sprint Begins',
        '12:00 PM - Submission Deadline',
        '1:00 PM - Lunch Break',
        '2:00 PM - Team Presentations',
        '4:00 PM - Judging & Deliberation',
        '5:30 PM - Awards Ceremony & Closing',
      ],
    },
  ];

  return (
    <section className="relative w-full py-16 md:py-24 bg-[#121212]">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Heading */}
        <h2
          className="text-center mb-16"
          style={{
            fontFamily: 'Decoy, sans-serif',
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 500,
            color: '#f7efe3',
            transform: 'rotate(-1.5deg)',
          }}
        >
          EVENT SCHEDULE
        </h2>

        {/* Timeline */}
        <div className="space-y-8">
          {timeline.map((day, idx) => (
            <div
              key={day.time}
              className="border-2 border-[#e8ddd0] rounded-[28px] bg-[#f7efe3] p-8"
              style={{ transform: `rotate(${[-0.5, 0.5, -0.5][idx]}deg)` }}
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
                {/* Day Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b-2 border-[#1e1e1e]">
                  <div>
                    <div
                      className="text-sm mb-1"
                      style={{
                        fontFamily: 'Raleway, sans-serif',
                        fontWeight: 700,
                        color: '#E6B800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {day.time}
                    </div>
                    <h3
                      className="text-3xl"
                      style={{ fontFamily: 'Decoy, sans-serif', fontWeight: 500, color: '#1e1e1e' }}
                    >
                      {day.title}
                    </h3>
                  </div>
                </div>

                {/* Schedule Items */}
                <div className="space-y-3">
                  {day.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: '#E6B800' }}
                      />
                      <p
                        className="text-base"
                        style={{
                          fontFamily: 'Raleway, sans-serif',
                          fontWeight: 600,
                          color: '#403f3e',
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
