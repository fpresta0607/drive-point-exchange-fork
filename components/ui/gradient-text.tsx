"use client"
import React from "react";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const MotionSpan = motion.create("span");

interface GradientTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  className?: string;
  children: React.ReactNode;
}

function GradientText({
  className,
  children,
  ...props
}: GradientTextProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionSpan
      className={cn(
        "relative inline-block",
        className,
      )}
      animate={prefersReducedMotion ? {} : {
        textShadow: [
          "0 0 20px rgba(25,52,181,0.4), 0 0 40px rgba(100,160,255,0.2), 0 0 80px rgba(25,52,181,0.1)",
          "0 0 35px rgba(140,190,255,0.5), 0 0 70px rgba(25,52,181,0.4), 0 0 120px rgba(100,160,255,0.15)",
          "0 0 20px rgba(25,52,181,0.4), 0 0 40px rgba(100,160,255,0.2), 0 0 80px rgba(25,52,181,0.1)",
        ],
        filter: [
          "brightness(1)",
          "brightness(1.15)",
          "brightness(1)",
        ],
      }}
      transition={prefersReducedMotion ? { duration: 0 } : {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      {...props}
    >
      <span
        className="inline-block bg-clip-text text-transparent animate-gradient-text-sweep"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #ffffff 0%, #e0eaff 10%, #b8ccff 20%, #8aadff 30%, #5b8fff 42%, #3a6fff 50%, #5b8fff 58%, #8aadff 70%, #b8ccff 80%, #e0eaff 90%, #ffffff 100%)",
          backgroundSize: "400% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </span>
    </MotionSpan>
  );
}

export { GradientText }
