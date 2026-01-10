'use client';

import React, { useEffect, useRef } from 'react';

interface SparklesProps {
  density?: number;
  speed?: number;
  color?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Sparkles: React.FC<SparklesProps> = ({
  density = 1200,
  speed = 1,
  color = '#ffffff',
  direction = 'top',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = direction === 'top' ? canvas.height : 0;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * speed * 0.5;
        this.speedY = direction === 'top' ? -Math.random() * speed : Math.random() * speed;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.01 + 0.005;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= this.fadeSpeed;

        // Reset particle if it goes off screen or fades out
        if (this.opacity <= 0 || this.y < 0 || this.y > canvas.height) {
          this.x = Math.random() * canvas.width;
          this.y = direction === 'top' ? canvas.height : 0;
          this.opacity = Math.random() * 0.5 + 0.2;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    const particleCount = Math.floor(density / 10);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, speed, color, direction]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
};