import React from 'react';

export const Watermark: React.FC<{ opacity?: number; size?: number | string }> = ({
  opacity = 0.08,
  size = 460
}) => {
  return (
    <div
      className="pointer-events-none select-none flex items-center justify-center overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        style={{ width: size, height: size }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wmShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1A36" />
            <stop offset="50%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#050C19" />
          </linearGradient>
          <linearGradient id="wmGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        <path
          d="M100 15 L175 40 C175 110 145 160 100 185 C55 160 25 110 25 40 Z"
          fill="url(#wmShieldGrad)"
          stroke="url(#wmGoldGrad)"
          strokeWidth="6"
        />

        <path
          d="M70 70 L65 50 L85 62 L100 45 L115 62 L135 50 L130 70 Z"
          fill="url(#wmGoldGrad)"
        />
        <circle cx="65" cy="50" r="3.5" fill="#EF4444" />
        <circle cx="100" cy="45" r="4.5" fill="#10B981" />
        <circle cx="135" cy="50" r="3.5" fill="#EF4444" />

        <path
          d="M60 100 Q100 88 100 115 Q100 88 140 100 L140 135 Q100 120 100 145 Q100 120 60 135 Z"
          fill="#FFFFFF"
          stroke="url(#wmGoldGrad)"
          strokeWidth="2.5"
        />
        <line x1="100" y1="115" x2="100" y2="145" stroke="#0B1A36" strokeWidth="2" />

        <rect x="55" y="150" width="90" height="20" rx="4" fill="url(#wmGoldGrad)" />
        <text
          x="100"
          y="164"
          fontFamily="Georgia, serif"
          fontSize="12"
          fontWeight="bold"
          fill="#0B1A36"
          textAnchor="middle"
        >
          GKAC
        </text>
      </svg>
    </div>
  );
};
