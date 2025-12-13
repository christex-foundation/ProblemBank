'use client';

import React, { useState, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';

const Big5SubmissionForm = dynamic(() => import('./big5/Big5SubmissionForm'), {
  ssr: false,
});

interface HackathonStage {
  id: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string;
  status: 'upcoming' | 'active' | 'completed';
}

const HACKATHON_STAGES: HackathonStage[] = [
  {
    id: 'call-for-applications',
    title: 'Call for Applications',
    startDate: new Date('2025-09-01T00:00:00Z'),
    endDate: new Date('2025-10-17T23:59:59Z'),
    description: 'Applications open for all tracks.',
    status: 'upcoming'
  },
  {
    id: 'shortlisting',
    title: 'Shortlisting',
    startDate: null,
    endDate: null,
    description: 'Review and selection of applicants.',
    status: 'upcoming'
  },
  {
    id: 'notification',
    title: 'Notification',
    startDate: null,
    endDate: null,
    description: 'Successful applicants are notified and assigned to tracks.',
    status: 'upcoming'
  },
  {
    id: 'preparation-period',
    title: 'Preparation Period',
    startDate: null,
    endDate: null,
    description: 'Teams prepare for the hackathon with virtual mentorship.',
    status: 'upcoming'
  },
  {
    id: 'bootcamp',
    title: 'Bootcamp (Freetown)',
    startDate: new Date('2025-11-10T00:00:00Z'),
    endDate: new Date('2025-11-19T23:59:59Z'),
    description: '10-day immersive training with AI & blockchain experts. Team formation.',
    status: 'active'
  },
  {
    id: 'solution-development',
    title: 'Solution Development Standstill',
    startDate: null,
    endDate: null,
    description: 'Teams refine prototypes with virtual mentorship and assessments.',
    status: 'upcoming'
  },
  {
    id: 'final-hackathon',
    title: 'Hackathon Started!',
    startDate: new Date('2025-11-26T00:00:00Z'),
    endDate: new Date('2025-12-07T23:59:59Z'),
    description: 'Two-Week Innovation Sprint: Build Solutions, Refine Prototypes, Showcase Your Work, and Compete for Prizes!',
    status: 'active'
  },
  {
    id: 'review-period',
    title: 'Review in Progress',
    startDate: new Date('2025-12-08T00:00:00Z'),
    endDate: new Date('2025-12-11T23:59:59Z'),
    description: 'Our team is reviewing all submissions. Winners will be announced soon!',
    status: 'active'
  }
];

function getCurrentStage(): HackathonStage | null {
  const now = new Date();

  // Check if we're in the review period (Dec 8-11)
  const reviewStage = HACKATHON_STAGES.find(stage => stage.id === 'review-period');
  if (reviewStage && reviewStage.startDate && reviewStage.endDate) {
    if (now >= reviewStage.startDate && now <= reviewStage.endDate) {
      return { ...reviewStage, status: 'active' };
    }
  }

  // Check if we're in the final hackathon period (Nov 26 - Dec 7)
  const finalHackathonStage = HACKATHON_STAGES.find(stage => stage.id === 'final-hackathon');
  if (finalHackathonStage && finalHackathonStage.startDate && finalHackathonStage.endDate) {
    if (now >= finalHackathonStage.startDate && now <= finalHackathonStage.endDate) {
      return { ...finalHackathonStage, status: 'active' };
    }
  }

  // If past review period, show review as completed
  if (reviewStage && reviewStage.endDate && now > reviewStage.endDate) {
    return { ...reviewStage, status: 'completed' };
  }

  // Fallback to first stage if no active stage found
  return HACKATHON_STAGES.length > 0 ? { ...HACKATHON_STAGES[0], status: 'upcoming' } : null;
}

function formatDateRange(startDate: Date | null, endDate: Date | null): string {
  if (!startDate || !endDate) return 'TBC';
  
  const start = startDate.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short' 
  });
  const end = endDate.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  });
  
  return `${start} - ${end}`;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const HackathonStageBanner = memo(function HackathonStageBanner() {
  const [currentStage, setCurrentStage] = useState<HackathonStage | null>(null);
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calculateCountdown = (endDate: Date | null): CountdownTime => {
    if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();
    
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const updateStageAndCountdown = () => {
      const stage = getCurrentStage();
      setCurrentStage(stage);

      if (stage?.endDate) {
        setCountdown(calculateCountdown(stage.endDate));
      }
    };

    updateStageAndCountdown();

    // Only update countdown if component is visible and stage is active
    const stage = getCurrentStage();
    if (!stage?.endDate || stage.status === 'completed') {
      return; // No need for interval if no countdown needed
    }

    // Use requestAnimationFrame for better performance, but throttle to ~1 update per second
    let rafId: number;
    let lastUpdate = Date.now();

    const tick = () => {
      const now = Date.now();
      if (now - lastUpdate >= 1000) { // Only update once per second
        lastUpdate = now;
        const newCountdown = calculateCountdown(stage.endDate);
        setCountdown(newCountdown);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!currentStage) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#E6B800] text-[#1e1e1e] border-2 border-[#1e1e1e]';
      case 'upcoming':
        return 'bg-[#f2e8dc] text-[#403f3e]';
      case 'completed':
        return 'bg-[#d8cdbc] text-[#403f3e]';
      default:
        return 'bg-[#f2e8dc] text-[#403f3e]';
    }
  };

  const getStatusText = (status: string, stageId?: string) => {
    if (stageId === 'review-period' && status === 'active') {
      return 'Review in Progress';
    }
    switch (status) {
      case 'active':
        return 'Currently Active';
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      default:
        return 'Upcoming';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-2">
      <div
        className="block relative border border-[#e8ddd0] shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#d8cdbc] overflow-hidden rounded-[28px] p-6 md:p-8"
        style={{
          backgroundColor: currentStage.status === 'active' ? '#513f2a' : '#F1E7DB',
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
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(currentStage.status)}`}
            >
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{
                  backgroundColor: currentStage.status === 'active' ? '#1e1e1e' : '#403f3e',
                }}
              />
              {getStatusText(currentStage.status, currentStage.id)}
            </div>
            
            {/* Date Range */}
            <div
              className="text-sm font-medium"
              style={{
                fontFamily: 'Raleway, sans-serif',
                color: currentStage.status === 'active' ? '#fff' : '#403f3e',
              }}
            >
              {formatDateRange(currentStage.startDate, currentStage.endDate)}
            </div>
          </div>

          {/* Stage Title */}
          <h2
            className="text-2xl md:text-3xl lg:text-4xl mb-3"
            style={{
              fontFamily: 'Decoy, sans-serif',
              fontWeight: 500,
              color: currentStage.status === 'active' ? '#fff' : '#403f3e',
            }}
          >
            {currentStage.title}
          </h2>

          {/* Description */}
          <p
            className="text-base md:text-lg leading-relaxed mb-6"
            style={{
              fontFamily: 'Raleway, sans-serif',
              color: currentStage.status === 'active' ? '#fff' : '#403f3e',
              fontWeight: 600,
            }}
          >
            {currentStage.description}
          </p>

          {/* Countdown Timer */}
          {currentStage.endDate && currentStage.status !== 'completed' && (
            <div className="mt-6">
              <div className="flex items-center  justify-end *:border-r *:pr-3">
                {/* Days */}
                <div className="flex flex-col items-center">
                  <div
                    className="text-xl md:text-xl font-bold mb-1"
                    style={{
                      fontFamily: 'Decoy, sans-serif',
                      color: currentStage.status === 'active' ? '#fff' : '#403f3e',
                    }}
                  >
                    {String(countdown.days).padStart(2, '0')}
                  </div>
                  <div
                    className="text-xs uppercase tracking-wide"
                    style={{
                      fontFamily: 'Raleway, sans-serif',
                      color: currentStage.status === 'active' ? '#fff' : '#403f3e',
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
                      color: currentStage.status === 'active' ? '#fff' : '#403f3e',
                    }}
                  >
                    {String(countdown.hours).padStart(2, '0')}
                  </div>
                  <div
                    className="text-xs uppercase tracking-wide"
                    style={{
                      fontFamily: 'Raleway, sans-serif',
                      color: currentStage.status === 'active' ? '#fff' : '#403f3e',
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
                      color: currentStage.status === 'active' ? '#fff' : '#403f3e',
                    }}
                  >
                    {String(countdown.minutes).padStart(2, '0')}
                  </div>
                  <div
                    className="text-xs uppercase tracking-wide"
                    style={{
                      fontFamily: 'Raleway, sans-serif',
                      color: currentStage.status === 'active' ? '#fff' : '#403f3e',
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
                      color: currentStage.status === 'active' ? '#fff' : '#403f3e',
                    }}
                  >
                    {String(countdown.seconds).padStart(2, '0')}
                  </div>
                  <div
                    className="text-xs uppercase tracking-wide"
                    style={{
                      fontFamily: 'Raleway, sans-serif',
                      color: currentStage.status === 'active' ? '#fff' : '#403f3e',
                      opacity: 0.8,
                    }}
                  >
                    Seconds
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage Completed Message */}
          {currentStage.status === 'completed' && (
            <div className="mt-6 text-center">
              <div
                className="text-lg font-semibold"
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  color: '#403f3e',
                }}
              >
                Stage Completed
              </div>
            </div>
          )}

          {/* Submit Idea Button - Only show when hackathon is active and before deadline, but NOT during review period */}
          {currentStage.status === 'active' && currentStage.id !== 'review-period' && currentStage.endDate && new Date() < currentStage.endDate && (
            <div className="mt-8 flex justify-center">
              <Big5SubmissionForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default HackathonStageBanner;
