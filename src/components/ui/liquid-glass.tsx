'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface Colors {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  color6: string;
  color7: string;
  color8: string;
  color9: string;
  color10: string;
  color11: string;
  color12: string;
  color13: string;
  color14: string;
  color15: string;
  color16: string;
  color17: string;
}

interface LiquidProps {
  isHovered: boolean;
  colors: Colors;
  buttonType?: boolean;
}

export function Liquid({ isHovered, colors, buttonType = false }: LiquidProps) {
  return (
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 500 500'
      xmlns='http://www.w3.org/2000/svg'
      className='absolute inset-0'
      style={{ filter: buttonType ? 'url(#goo)' : 'url(#goo2)' }}
    >
      <defs>
        <filter id='goo'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='12' result='blur' />
          <feColorMatrix
            in='blur'
            mode='matrix'
            values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7'
            result='goo'
          />
          <feBlend in='SourceGraphic' in2='goo' />
        </filter>
        <filter id='goo2'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='10' result='blur' />
          <feColorMatrix
            in='blur'
            mode='matrix'
            values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7'
            result='goo'
          />
          <feBlend in='SourceGraphic' in2='goo' />
        </filter>
      </defs>
      <g className={`transition-transform duration-1000 ${isHovered ? 'animate-liquid-hover' : 'animate-liquid'}`}>
        <circle cx='73.5' cy='159.8' r='30.7' fill={colors.color1} />
        <circle cx='127.7' cy='73.8' r='65.3' fill={colors.color2} />
        <circle cx='226.8' cy='367.4' r='77.5' fill={colors.color3} />
        <circle cx='313.3' cy='125.9' r='62.1' fill={colors.color4} />
        <circle cx='89.1' cy='373.5' r='55.5' fill={colors.color5} />
        <circle cx='366.1' cy='361.7' r='59.1' fill={colors.color6} />
        <circle cx='250' cy='250' r='62.1' fill={colors.color7} />
        <circle cx='411.4' cy='214.8' r='49.6' fill={colors.color8} />
        <circle cx='185.3' cy='197.4' r='60.8' fill={colors.color9} />
        <circle cx='366.1' cy='77.2' r='37.6' fill={colors.color10} />
        <circle cx='250' cy='143.1' r='53.7' fill={colors.color11} />
        <circle cx='164.7' cy='298.7' r='48.3' fill={colors.color12} />
        <circle cx='73.5' cy='250' r='43.8' fill={colors.color13} />
        <circle cx='289.2' cy='298.7' r='32.8' fill={colors.color14} />
        <circle cx='319.9' cy='250' r='42.5' fill={colors.color15} />
        <circle cx='250' cy='356.9' r='35.4' fill={colors.color16} />
        <circle cx='427.9' cy='125.9' r='29.4' fill={colors.color17} />
      </g>
    </svg>
  );
}

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowIntensity?: 'sm' | 'md' | 'lg';
  shadowIntensity?: 'sm' | 'md' | 'lg';
  borderRadius?: string;
  blurIntensity?: 'sm' | 'md' | 'lg';
  draggable?: boolean;
}

const glowIntensityMap = {
  sm: 'shadow-[0_0_15px_rgba(255,255,255,0.1)]',
  md: 'shadow-[0_0_25px_rgba(255,255,255,0.2)]',
  lg: 'shadow-[0_0_35px_rgba(255,255,255,0.3)]',
};

const shadowIntensityMap = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const blurIntensityMap = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
};

export function LiquidGlassCard({
  children,
  className,
  glowIntensity = 'md',
  shadowIntensity = 'md',
  borderRadius = '16px',
  blurIntensity = 'md',
  draggable = false,
}: LiquidGlassCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-white/10 dark:bg-black/10 border border-white/20',
        blurIntensityMap[blurIntensity],
        glowIntensityMap[glowIntensity],
        shadowIntensityMap[shadowIntensity],
        draggable && 'cursor-move',
        className
      )}
      style={{
        borderRadius,
      }}
      draggable={draggable}
    >
      {/* Liquid glass effect overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"
        style={{
          borderRadius,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}