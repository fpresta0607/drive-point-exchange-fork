import type { Transition, Variants } from 'framer-motion';

export const iosEase: [number, number, number, number] = [0.32, 0.72, 0, 1];

export const iosSpring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
  mass: 1,
};

export const iosSpringSoft: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 30,
};

export const sectionReveal: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

export const sectionItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: iosSpring },
};

export const crossFade: Transition = { duration: 0.25, ease: iosEase };

export const hoverLift = {
  y: -4,
  transition: { type: 'spring', stiffness: 400, damping: 30 },
} as const;
