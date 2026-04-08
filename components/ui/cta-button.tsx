import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  variant?: "primary" | "primary-dark" | "secondary" | "hero";
  size?: "default" | "lg";
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showArrow?: boolean;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  children: React.ReactNode;
}

const sizeClasses = {
  default: "py-4 px-8",
  lg: "py-5 px-10",
} as const;

const variantClasses = {
  primary: "bg-dpe-green text-white",
  "primary-dark": "bg-dpe-navy text-white",
  secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
  hero: "bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/15 hover:border-white/40 text-white",
} as const;

const slideColor = {
  primary: "bg-dpe-green/80",
  "primary-dark": "bg-dpe-blue",
  secondary: "",
  hero: "",
} as const;

export function CTAButton({
  variant = "primary",
  size = "default",
  href,
  onClick,
  showArrow = false,
  className,
  disabled = false,
  type = "button",
  children,
}: CTAButtonProps) {
  const hasSlide = variant !== "secondary" && variant !== "hero";

  const inner = (
    <>
      {hasSlide && (
        <div
          className={cn(
            "absolute inset-0 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
            slideColor[variant]
          )}
        />
      )}
      <span
        className={cn(
          "relative z-10 text-overline transition-colors duration-500",
          hasSlide && "group-hover:text-white"
        )}
      >
        {children}
      </span>
      {showArrow && (
        <div className="relative z-10 w-8 h-8 bg-white/15 rounded-full flex items-center justify-center group-hover:bg-white/25 transition-colors duration-500">
          <ArrowUpRight className="w-4 h-4 group-hover:text-white transition-colors duration-500" />
        </div>
      )}
    </>
  );

  const sharedClasses = cn(
    "group relative inline-flex items-center justify-center gap-4 font-semibold rounded-full overflow-hidden transition-all hover:scale-[1.03] active:scale-[0.98]",
    sizeClasses[size],
    variantClasses[variant],
    variant === "hero" ? "hero-cta-pulse" : hasSlide && "cta-border-pulse",
    disabled && "opacity-50 cursor-not-allowed hover:scale-100 active:scale-100",
    className
  );

  if (href) {
    return (
      <Link href={href} className={sharedClasses}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={sharedClasses}
    >
      {inner}
    </button>
  );
}
