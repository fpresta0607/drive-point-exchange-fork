import * as React from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface SparkItem {
  id: string | number;
  imageSrc: string;
  title: string;
  count?: number;
  countLabel?: string;
  description?: string;
  features?: string[];
}

export interface SparksCarouselProps {
  title: string;
  subtitle: string;
  items: SparkItem[];
}

export const SparksCarousel = React.forwardRef<
  HTMLDivElement,
  SparksCarouselProps
>(({ title, subtitle, items }, ref) => {
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = React.useState(true);
  const [isAtEnd, setIsAtEnd] = React.useState(false);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.8;
      const newScrollLeft =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };
  
  React.useEffect(() => {
    const checkScrollPosition = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setIsAtStart(scrollLeft < 10);
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
      }
    };

    const currentRef = carouselRef.current;
    if (currentRef) {
        checkScrollPosition();
        currentRef.addEventListener("scroll", checkScrollPosition);
    }
    
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScrollPosition);
      }
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [items]);

  return (
    <section ref={ref} className="w-full py-8" aria-labelledby="sparks-title">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <a href="#" className="group inline-flex items-center">
              <h2 id="sparks-title" className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                {title}
              </h2>
              <ChevronRight className="ml-2 h-6 w-6 text-white transition-transform group-hover:translate-x-1" />
            </a>
            <p className="mt-1 text-gray-400">{subtitle}</p>
          </div>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="flex w-full space-x-4 overflow-y-visible overflow-x-auto pb-4 pt-4 items-stretch scrollbar-hide"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className="group w-[280px] flex-shrink-0 flex flex-col"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, delay: index * 0.04 }}
              >
                <div 
                  className="overflow-hidden rounded-lg border bg-white text-gray-900 shadow-sm flex flex-col h-full"
                >
                  <div className="relative overflow-hidden h-[160px] w-full shrink-0">
                    <div className="w-full h-full transition-transform duration-200 group-hover:scale-105">
                      <Image
                        alt={item.title}
                        className="object-cover w-full h-full"
                        fill
                        src={item.imageSrc}
                        sizes="280px"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="p-5 bg-white flex flex-col flex-grow">
                    <h3 className="text-lg font-bold leading-tight text-gray-900 mb-3">
                      {item.title}
                    </h3>

                    <div className="text-sm flex flex-col flex-grow">
                      {item.description && (
                        <p className="text-gray-600 leading-relaxed mb-4 text-xs font-medium">
                          {item.description}
                        </p>
                      )}
                      {item.features && item.features.length > 0 && (
                        <ul className="space-y-2.5 mt-auto">
                          {item.features.map((feat, i) => (
                            <li key={i} className="flex items-start text-xs text-gray-700 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-dpe-blue mt-1.5 mr-2.5 shrink-0"></div>
                              <span className="leading-tight">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Arrow buttons - hidden on mobile (touch scroll), visible on md+ */}
          <button
            onClick={() => scroll("left")}
            className={cn(
              "hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all hover:bg-dpe-green/30 hover:border-dpe-green/40 hover:scale-110",
              isAtStart && "opacity-30 pointer-events-none"
            )}
            aria-label="Scroll left"
            disabled={isAtStart}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className={cn(
              "hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all hover:bg-dpe-green/30 hover:border-dpe-green/40 hover:scale-110",
              isAtEnd && "opacity-30 pointer-events-none"
            )}
            aria-label="Scroll right"
            disabled={isAtEnd}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
});

SparksCarousel.displayName = "SparksCarousel";
