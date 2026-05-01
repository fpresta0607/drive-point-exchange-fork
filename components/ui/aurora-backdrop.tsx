'use client';
import { motion, useReducedMotion } from 'framer-motion';

type AuroraVariant = 'fixed' | 'section' | 'band';

interface AuroraBackdropProps {
  variant?: AuroraVariant;
  className?: string;
  intensity?: 'normal' | 'soft';
  showGreenAccent?: boolean;
}

const NOISE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function AuroraBackdrop({
  variant = 'section',
  className = '',
  intensity = 'normal',
  showGreenAccent = true,
}: AuroraBackdropProps) {
  const reduced = useReducedMotion();

  const wrapperClass =
    variant === 'fixed'
      ? 'fixed inset-0 -z-10 pointer-events-none overflow-hidden'
      : 'absolute inset-0 -z-0 pointer-events-none overflow-hidden';

  const blueOpacity = intensity === 'soft' ? 0.32 : 0.45;
  const greenOpacity = intensity === 'soft' ? 0.2 : 0.28;
  const lightBlueOpacity = intensity === 'soft' ? 0.16 : 0.22;

  const orb2Animate = reduced
    ? undefined
    : { x: ['0%', '4%', '0%'], y: ['0%', '-3%', '0%'] };
  const orb2Transition = reduced
    ? undefined
    : { duration: 30, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <div className={`${wrapperClass} ${className}`}>
      {/* Base radial wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, #0B1644 0%, #050B2E 45%, #020720 100%), #020720',
        }}
      />

      {/* Orb 1 — top-left, blue */}
      <div
        className="absolute"
        style={{
          top: '-10%',
          left: '-5%',
          width: 'min(720px, 60vw)',
          height: 'min(720px, 60vw)',
          background: `radial-gradient(circle, rgba(25, 52, 181, ${blueOpacity}), transparent 65%)`,
          filter: 'blur(120px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Orb 2 — bottom-right, green (drifts) */}
      {showGreenAccent && (
        <motion.div
          className="absolute"
          style={{
            bottom: '-15%',
            right: '-10%',
            width: '70vw',
            height: '50vw',
            background: `radial-gradient(ellipse at center, rgba(45, 184, 67, ${greenOpacity}), transparent 60%)`,
            filter: 'blur(140px)',
            mixBlendMode: 'screen',
          }}
          animate={orb2Animate}
          transition={orb2Transition}
        />
      )}

      {/* Orb 3 — center-left, light blue (static) */}
      <div
        className="absolute"
        style={{
          top: '40%',
          left: '20%',
          width: '40vw',
          height: '40vw',
          background: `radial-gradient(circle, rgba(74, 111, 224, ${lightBlueOpacity}), transparent 70%)`,
          filter: 'blur(100px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Fractal noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG }}
      />
    </div>
  );
}
