'use client';

import { useEffect, useState } from 'react';

interface RandomizedTextEffectProps {
  text: string;
  className?: string;
  duration?: number;
}

export function RandomizedTextEffect({
  text,
  className = '',
  duration = 2000,
}: RandomizedTextEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let frame = 0;
    const totalFrames = Math.floor(duration / 30); // 30ms per frame
    
    const animate = () => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            
            const progress = frame / totalFrames;
            const charProgress = (index + 1) / text.length;
            
            if (progress > charProgress) {
              return text[index];
            }
            
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );
      
      frame++;
      
      if (frame <= totalFrames) {
        requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };
    
    animate();
  }, [text, duration, mounted, characters]);

  if (!mounted) {
    return <span className={className}>{text}</span>;
  }

  return <span className={className}>{displayText || text}</span>;
}