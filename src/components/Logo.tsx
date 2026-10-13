import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 48, showText = true, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative flex-shrink-0 transition-transform duration-200 hover:scale-105 rounded-xl overflow-hidden bg-white/95 p-1 shadow-md border border-amber-400/40"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B1A36" />
              <stop offset="50%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#050C19" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>

          {/* Shield Outline */}
          <path
            d="M100 15 L175 40 C175 110 145 160 100 185 C55 160 25 110 25 40 Z"
            fill="url(#shieldGrad)"
            stroke="url(#goldGrad)"
            strokeWidth="6"
          />

          {/* Inner Golden Border */}
          <path
            d="M100 25 L165 47 C165 106 140 148 100 171 C60 148 35 106 35 47 Z"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* Glorious Crown */}
          <path
            d="M70 70 L65 50 L85 62 L100 45 L115 62 L135 50 L130 70 Z"
            fill="url(#goldGrad)"
            stroke="#78350F"
            strokeWidth="1.5"
          />
          {/* Crown jewels */}
          <circle cx="65" cy="50" r="3.5" fill="#EF4444" />
          <circle cx="100" cy="45" r="4.5" fill="#10B981" />
          <circle cx="135" cy="50" r="3.5" fill="#EF4444" />
          <circle cx="85" cy="62" r="2.5" fill="#3B82F6" />
          <circle cx="115" cy="62" r="2.5" fill="#3B82F6" />

          {/* Open Book */}
          <path
            d="M60 100 Q100 88 100 115 Q100 88 140 100 L140 135 Q100 120 100 145 Q100 120 60 135 Z"
            fill="#FFFFFF"
            stroke="url(#goldGrad)"
            strokeWidth="2.5"
          />
          {/* Book Spine & Lines */}
          <line x1="100" y1="115" x2="100" y2="145" stroke="#0B1A36" strokeWidth="2" />
          <line x1="72" y1="108" x2="92" y2="104" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="72" y1="116" x2="92" y2="112" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="72" y1="124" x2="92" y2="120" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="108" y1="104" x2="128" y2="108" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="108" y1="112" x2="128" y2="116" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="108" y1="120" x2="128" y2="124" stroke="#94A3B8" strokeWidth="1.5" />

          {/* Stars */}
          <polygon
            points="100,75 102,80 107,80 103,83 105,88 100,85 95,88 97,83 93,80 98,80"
            fill="url(#goldGrad)"
          />

          {/* Banner with GKAC */}
          <rect x="55" y="150" width="90" height="20" rx="4" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />
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

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-serif font-black tracking-tight leading-tight text-white text-sm sm:text-base">
            GLORIOUS KING
          </span>
          <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase leading-tight text-amber-300">
            Academy &amp; College
          </span>
          <span className="hidden sm:block text-[10px] tracking-widest uppercase font-medium text-emerald-200/80">
            Primary • College
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
