'use client';
import { useState, useEffect } from 'react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ReviewStage() {
  const [isReviewPeriod, setIsReviewPeriod] = useState(false);
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const HACKATHON_END = new Date('2025-12-08T00:00:00Z');
    const REVIEW_END = new Date('2025-12-17T23:59:59Z');

    const updateCountdown = () => {
      const now = new Date();
      setIsReviewPeriod(now >= HACKATHON_END && now < REVIEW_END);

      if (now >= HACKATHON_END && now < REVIEW_END) {
        const diff = Math.max(0, REVIEW_END.getTime() - now.getTime());
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();

    // Use requestAnimationFrame for better performance
    let rafId: number;
    let lastUpdate = Date.now();

    const tick = () => {
      const now = Date.now();
      if (now - lastUpdate >= 1000) {
        lastUpdate = now;
        updateCountdown();
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isReviewPeriod) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-10 md:mt-12">
      <div
        className="block relative border border-[#e8ddd0] shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#d8cdbc] overflow-hidden rounded-[28px] p-6 md:p-8"
        style={{
          backgroundColor: '#513f2a',
          transform: 'rotate(1.2deg)',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        <div className="relative z-10">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E6B800] text-[#1e1e1e] border-2 border-[#1e1e1e]">
              <div className="w-2 h-2 rounded-full mr-2 bg-[#1e1e1e]" />
              Completed
            </div>

            {/* Date Range */}
            <div
              className="text-sm font-medium"
              style={{
                fontFamily: 'Raleway, sans-serif',
                color: '#fff',
              }}
            >
              8 Dec - 17 Dec 2025
            </div>
          </div>

          {/* Stage Title */}
          <h2
            className="text-2xl md:text-3xl lg:text-4xl mb-3"
            style={{
              fontFamily: 'Decoy, sans-serif',
              fontWeight: 500,
              color: '#fff',
            }}
          >
            Review in Progress
          </h2>

          {/* Description */}
          <p
            className="text-base md:text-lg leading-relaxed mb-6"
            style={{
              fontFamily: 'Raleway, sans-serif',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Our team is reviewing all submissions. Winners will be announced soon!
          </p>

          {/* Countdown Timer */}
          <div className="mt-6">
            <div className="flex items-center justify-end *:border-r *:pr-3">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div
                  className="text-xl md:text-xl font-bold mb-1"
                  style={{
                    fontFamily: 'Decoy, sans-serif',
                    color: '#fff',
                  }}
                >
                  {String(countdown.days).padStart(2, '0')}
                </div>
                <div
                  className="text-xs uppercase tracking-wide"
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    color: '#fff',
                    opacity: 0.8,
                  }}
                >
                  Days
                </div>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div
                  className="text-xl md:text-xl font-bold mb-1"
                  style={{
                    fontFamily: 'Decoy, sans-serif',
                    color: '#fff',
                  }}
                >
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <div
                  className="text-xs uppercase tracking-wide"
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    color: '#fff',
                    opacity: 0.8,
                  }}
                >
                  Hours
                </div>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div
                  className="text-xl md:text-xl font-bold mb-1"
                  style={{
                    fontFamily: 'Decoy, sans-serif',
                    color: '#fff',
                  }}
                >
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <div
                  className="text-xs uppercase tracking-wide"
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    color: '#fff',
                    opacity: 0.8,
                  }}
                >
                  Minutes
                </div>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center border-none">
                <div
                  className="text-xl md:text-xl font-bold mb-1"
                  style={{
                    fontFamily: 'Decoy, sans-serif',
                    color: '#fff',
                  }}
                >
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <div
                  className="text-xs uppercase tracking-wide"
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    color: '#fff',
                    opacity: 0.8,
                  }}
                >
                  Seconds
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
