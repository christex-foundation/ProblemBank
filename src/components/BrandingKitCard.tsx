'use client';

import React from 'react';
import Image from 'next/image';

export interface BrandingKitCardProps {
  onStartBuilding: () => void;
  compact?: boolean;
  title?: string;
  description?: string;
  tags?: string[];
  items?: string[];
  moreLabel?: string;
  iconSrc?: string;
}

const BrandingKitCard: React.FC<BrandingKitCardProps> = ({
  onStartBuilding,
  compact,
  title = 'COMPLETE BRANDING KIT',
  description = 'Create a comprehensive brand identity from strategy to visual assets. Guides you through market research, brand positioning, and visual identity creation using AI tools.',
  tags = ['branding', 'design', 'strategy'],
  items = [
    'Brand strategy document',
    'Logo and visual assets',
    'Brand voice guidelines',
  ],
  moreLabel = '+2 more',
  iconSrc,
}) => {
  return (
    <div
      className="relative border border-[#e8ddd0] shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#d8cdbc] overflow-hidden rounded-[28px] md:rounded-[34px] lg:rounded-[38px] mt-8"
      style={{
        backgroundColor: '#fffaf3',
        padding: '24px',
        ...(compact ? {} : { maxWidth: '400px', margin: '32px auto 0' }),
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

      <div className="relative">
        {/* Optional icon */}
        {iconSrc && (
          <div className="flex justify-center mb-3">
            <Image src={iconSrc} alt="kit icon" width={56} height={56} style={{ display: 'block' }} loading="lazy" quality={85} />
          </div>
        )}

        {/* Title */}
        <h3
          className="text-2xl mb-3 leading-tight text-center"
          style={{
            fontFamily: 'Decoy, sans-serif',
            fontWeight: 500,
            color: '#403f3e',
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-4 text-center"
          style={{
            fontFamily: 'Raleway, sans-serif',
            color: '#403f3e',
            fontWeight: 400,
          }}
        >
          {description}
        </p>

        {/* You'll Create section */}
        <div className="mb-6">
          <h4
            className="text-sm font-semibold mb-3 flex items-center justify-center"
            style={{
              fontFamily: 'Raleway, sans-serif',
              color: '#403f3e',
            }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
              style={{ backgroundColor: '#403f3e' }}
            >
              <span className="text-white text-xs">●</span>
            </span>
            YOU&apos;LL CREATE:
          </h4>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3 flex items-center justify-center"
                  style={{ backgroundColor: '#e8f5e8', border: '1px solid #c3e6c3' }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2d5a2d' }} />
                </div>
                <span
                  className="text-sm"
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    color: '#403f3e',
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
            {moreLabel && (
              <div className="flex items-center">
                <span
                  className="text-sm ml-7"
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    color: '#666',
                  }}
                >
                  {moreLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: 'transparent',
                  color: '#403f3e',
                  border: '1px solid #d8cdbc',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Start Building button */}
        <button
          onClick={onStartBuilding}
          className="w-full py-3 px-6 rounded-full text-white font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          style={{
            backgroundColor: '#403f3e',
            fontFamily: 'Raleway, sans-serif',
          }}
        >
          Start Building
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="ml-2">
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BrandingKitCard;