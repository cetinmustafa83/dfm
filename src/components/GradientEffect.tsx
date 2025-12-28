'use client';

import { useEffect, useState } from 'react';

interface GradientEffectProps {
  variant?: 'top-bar' | 'full-background' | 'overlay';
  className?: string;
  children?: React.ReactNode;
}

/**
 * GradientEffect Component
 * 
 * A reusable component that creates an animated colorful gradient effect
 * similar to the one on pro.ui-layouts.com
 * 
 * @param variant - The style variant of the gradient effect
 *   - 'top-bar': A thin gradient bar (great for navigation bars)
 *   - 'full-background': Full animated gradient background
 *   - 'overlay': Gradient overlay effect on content
 * @param className - Additional CSS classes to apply
 * @param children - Child elements (only used with 'overlay' variant)
 */
export function GradientEffect({ 
  variant = 'top-bar', 
  className = '',
  children 
}: GradientEffectProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  if (variant === 'top-bar') {
    return (
      <div className={`top-gradient-bar ${className}`} />
    );
  }

  if (variant === 'full-background') {
    return (
      <div className={`${isDark ? 'gradient-bg-dark' : 'gradient-bg'} ${className}`}>
        {children}
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className={`gradient-overlay ${className}`}>
        {children}
      </div>
    );
  }

  return null;
}

// Export individual components for more flexibility
export function TopGradientBar({ className = '' }: { className?: string }) {
  return <GradientEffect variant="top-bar" className={className} />;
}

export function GradientBackground({ 
  children, 
  className = '' 
}: { 
  children?: React.ReactNode; 
  className?: string;
}) {
  return (
    <GradientEffect variant="full-background" className={className}>
      {children}
    </GradientEffect>
  );
}

export function GradientOverlay({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <GradientEffect variant="overlay" className={className}>
      {children}
    </GradientEffect>
  );
}