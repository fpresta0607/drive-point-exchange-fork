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
  const ulRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<(HTMLLIElement | null)[]>([]);

  const activeIndex = tabs.findIndex((t) => t.isActive);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cursor, setCursor] = useState({ left: 0, width: 0, opacity: 0 });
  const hasMounted = useRef(false);

  const measureTab = useCallback(
    (index: number) => {
      const el = tabRefs.current[index];
      if (!el) return null;
      return { left: el.offsetLeft, width: el.offsetWidth };
    },
    []
  );

  // Update cursor position when hovered or active tab changes
  useEffect(() => {
    const target = hoveredIndex ?? activeIndex;
    if (target < 0) {
      setCursor((prev) => ({ ...prev, opacity: 0 }));
      return;
    }
    const m = measureTab(target);
    if (m) {
      setCursor({ left: m.left, width: m.width, opacity: 1 });
    }
    // Mark as mounted after first position is set
    if (!hasMounted.current) {
      hasMounted.current = true;
    }
  }, [hoveredIndex, activeIndex, measureTab]);

  // Re-measure on tab label changes (i18n) by watching tab labels
  const labelsKey = tabs.map((t) => t.label).join("|");
  useEffect(() => {
    const target = hoveredIndex ?? activeIndex;
    if (target < 0) return;
    // Small delay to let the DOM reflow after text changes
    const id = requestAnimationFrame(() => {
      const m = measureTab(target);
      if (m) setCursor({ left: m.left, width: m.width, opacity: 1 });
    });
    return () => cancelAnimationFrame(id);
  }, [labelsKey, hoveredIndex, activeIndex, measureTab]);

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    // Cursor returns to active tab (handled by the effect above)
  };

  return (
    <div className={cn("relative", className)}>
      <ul
        ref={ulRef}
        className={cn(
          "relative flex items-center p-1",
          "pill-nav-border"
        )}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated gradient cursor */}
        <motion.li
          className="absolute top-1 bottom-1 z-0 rounded-full"
          style={{
            background: "linear-gradient(to right, #1934B5, #2DB843)",
          }}
          initial={false}
          animate={{
            left: cursor.left,
            width: cursor.width,
            opacity: cursor.opacity,
          }}
          transition={
            prefersReducedMotion || !hasMounted.current
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
                    "ml-1 h-3.5 w-3.5 transition-transform duration-200",
                    tab.dropdownContent ? "rotate-180" : ""
                  )}
                />
              )}
            </>
          );

          const tabClasses = cn(
            "relative z-10 flex items-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer select-none",
            showWhite
              ? "text-white"
              : isTransparent
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-600 hover:text-gray-900"
          );

          return (
            <li
              key={i}
              ref={(el) => {
                tabRefs.current[i] = el;
                // Also assign to the external wrapperRef if provided (for click-outside)
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
