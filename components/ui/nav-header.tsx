"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavTab {
  label: string;
  href?: string;
  onClick?: () => void;
  isDropdown?: boolean;
  isActive?: boolean;
  dropdownContent?: React.ReactNode;
  wrapperRef?: React.RefObject<HTMLLIElement | null>;
}

interface NavHeaderProps {
  tabs: NavTab[];
  isTransparent?: boolean;
  className?: string;
}

function NavHeader({ tabs, isTransparent = false, className }: NavHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const tabRefs = useRef<(HTMLLIElement | null)[]>([]);

  const activeIndex = tabs.findIndex((t) => t.isActive);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const measureTab = useCallback(
    (index: number) => {
      const el = tabRefs.current[index];
      if (!el) return null;
      return { left: el.offsetLeft, width: el.offsetWidth };
    },
    []
  );

  const target = hoveredIndex ?? activeIndex;
  const measured = target >= 0 ? measureTab(target) : null;
  const cursor = measured
    ? { left: measured.left, width: measured.width, opacity: 1 }
    : { left: 0, width: 0, opacity: 0 };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Re-measure on tab label changes (i18n)
  const labelsKey = tabs.map((t) => t.label).join("|");
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => forceUpdate((n) => n + 1));
    return () => cancelAnimationFrame(id);
  }, [labelsKey]);

  return (
    <div className={cn("relative", className)}>
      <ul
        className={cn(
          "relative flex items-center p-1",
          isTransparent
            ? "border border-white/10 bg-white/[0.03] backdrop-blur-sm"
            : "border border-slate-200/80 bg-slate-50/60"
        )}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Animated cursor — white over hero (inverted), slate-900 over scrolled nav */}
        <motion.li
          className={cn(
            "absolute top-1 bottom-1 z-0",
            isTransparent ? "bg-white" : "bg-slate-900"
          )}
          initial={false}
          animate={cursor}
          transition={
            prefersReducedMotion || !hasMounted
              ? { duration: 0 }
              : { type: "tween", duration: 0.12, ease: "easeOut" }
          }
          aria-hidden
        />

        {/* Tab items */}
        {tabs.map((tab, i) => {
          const isHovered = hoveredIndex === i;
          const showWhite = isHovered || (hoveredIndex === null && tab.isActive);

          const tabContent = (
            <>
              <span>{tab.label}</span>
              {tab.isDropdown && (
                <ChevronDown
                  className={cn(
                    "ml-1 h-3.5 w-3.5 transition-transform duration-150",
                    tab.dropdownContent ? "rotate-180" : ""
                  )}
                />
              )}
            </>
          );

          const tabClasses = cn(
            "relative z-10 flex items-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors duration-75 cursor-pointer select-none",
            showWhite
              ? isTransparent
                ? "text-slate-900"
                : "text-white"
              : isTransparent
                ? "text-white/70 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
          );

          return (
            <li
              key={i}
              ref={(el) => {
                tabRefs.current[i] = el;
                if (tab.wrapperRef && "current" in tab.wrapperRef) {
                  (tab.wrapperRef as React.MutableRefObject<HTMLLIElement | null>).current = el;
                }
              }}
              className="relative"
              onMouseEnter={() => setHoveredIndex(i)}
            >
              {tab.href ? (
                <Link href={tab.href} className={tabClasses}>
                  {tabContent}
                </Link>
              ) : (
                <button
                  onClick={tab.onClick}
                  className={tabClasses}
                  aria-haspopup={tab.isDropdown ? "true" : undefined}
                  aria-expanded={
                    tab.isDropdown && tab.dropdownContent ? true : undefined
                  }
                >
                  {tabContent}
                </button>
              )}

              {/* Dropdown panel */}
              {tab.dropdownContent && (
                <div className="absolute left-0 top-full mt-2 z-50">
                  {tab.dropdownContent}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { NavHeader };
export type { NavTab, NavHeaderProps };
