'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WordRotateProps {
  words: string[];
  duration?: number;
  className?: string;
}

function WordRotate({ words, duration = 2500, className }: WordRotateProps) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || words.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, duration);
    return () => clearInterval(id);
  }, [words.length, duration, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span className={cn('inline-block', className)}>{words[0]}</span>;
  }

  return (
    <span className={cn('inline-block overflow-hidden align-baseline', className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -18, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export { WordRotate };
export type { WordRotateProps };
