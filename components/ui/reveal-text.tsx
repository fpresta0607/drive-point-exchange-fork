"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  text?: string;
  textColor?: string;
  overlayColor?: string;
  fontSize?: string;
  letterDelay?: number;
  overlayDelay?: number;
  overlayDuration?: number;
  springDuration?: number;
  letterImages?: string[];
  className?: string;
}

export function RevealText({
  text = "DRIVE",
  textColor = "text-white",
  overlayColor = "text-dpe-green",
  fontSize = "text-[clamp(4rem,15vw,12rem)]",
  letterDelay = 0.04,
  overlayDelay = 0.03,
  overlayDuration = 0.3,
  springDuration = 400,
  letterImages = [
    "/reveal-text/D.png",
    "/reveal-text/R.png",
    "/reveal-text/I.png",
    "/reveal-text/V.png",
    "/reveal-text/E.png",
  ],
  className,
}: RevealTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const lastLetterDelay = (text.length - 1) * letterDelay;
    const totalDelay = lastLetterDelay * 1000 + springDuration;

    const timer = setTimeout(() => {
      setShowOverlay(true);
    }, totalDelay);

    return () => clearTimeout(timer);
  }, [text.length, letterDelay, springDuration]);

  return (
    <div className={cn("flex items-center justify-center relative", className)}>
      <div className="flex">
        {text.split("").map((letter, index) => {
          if (letter === " ") {
            return <span key={index} className="inline-block w-[0.3em]" />;
          }

          return (
            <motion.span
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                fontSize,
                "font-black tracking-tight cursor-pointer relative overflow-hidden inline-block"
              )}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: index * letterDelay,
                type: "spring",
                damping: 14,
                stiffness: 300,
                mass: 0.6,
              }}
            >
              {/* Base text layer */}
              <motion.span
                className={cn("absolute inset-0", textColor)}
                animate={{ opacity: hoveredIndex === index ? 0 : 1 }}
                transition={{ duration: 0.1 }}
              >
                {letter}
              </motion.span>

              {/* Image text layer with background panning */}
              <motion.span
                className="text-transparent bg-clip-text bg-cover bg-no-repeat"
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  backgroundPosition:
                    hoveredIndex === index ? "10% center" : "0% center",
                }}
                transition={{
                  opacity: { duration: 0.1 },
                  backgroundPosition: { duration: 1.5, ease: "easeInOut" },
                }}
                style={{
                  backgroundImage: `url('${letterImages[index % letterImages.length]}')`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {letter}
              </motion.span>

              {/* Overlay sweep animation */}
              {showOverlay && (
                <motion.span
                  className={cn(
                    "absolute inset-0 pointer-events-none",
                    overlayColor
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    delay: index * overlayDelay,
                    duration: overlayDuration,
                    times: [0, 0.1, 0.7, 1],
                    ease: "easeInOut",
                  }}
                >
                  {letter}
                </motion.span>
              )}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
