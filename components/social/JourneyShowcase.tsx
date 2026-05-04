'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { SocialPost, Platform } from '@/lib/social/types';
import { EmbedCard } from '@/components/social/EmbedCard';
import { InstagramIcon } from '@/components/ui/instagram';
import { FacebookIcon } from '@/components/ui/facebook';
import { TiktokIcon } from '@/components/ui/tiktok';
import { YoutubeIcon } from '@/components/ui/youtube';
import { SectionKicker } from '@/components/ui/section-kicker';

const PLATFORM_ORDER: Platform[] = ['tiktok', 'youtube', 'instagram', 'facebook'];

const PROFILE_URLS: Record<Platform, string> = {
  instagram: 'https://www.instagram.com/drivepointexchange',
  facebook: 'https://www.facebook.com/drivepointexchange',
  tiktok: 'https://www.tiktok.com/@drivepointexchange',
  youtube: 'https://www.youtube.com/@drivepointexchange',
};

const PLATFORM_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TiktokIcon,
  youtube: YoutubeIcon,
} as const;

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

const PLATFORM_BLURBS: Record<Platform, string> = {
  instagram: 'Behind-the-scenes and customer wins.',
  facebook: 'Community stories and updates.',
  tiktok: 'Quick tips and moments.',
  youtube: 'Long-form deep dives.',
};

const VERTICAL_ASPECT: Platform[] = ['instagram', 'tiktok'];

function isVertical(platform: Platform): boolean {
  return VERTICAL_ASPECT.includes(platform);
}

export default function JourneyShowcase() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    fetch('/api/social/feed')
      .then(res => (res.ok ? res.json() : { posts: [] }))
      .then(data => setPosts(data.posts || []))
      .catch(() => setPosts([]));
  }, []);

  const postsByPlatform = useMemo(() => {
    const map = new Map<Platform, SocialPost>();
    for (const post of posts) {
      if (!map.has(post.platform)) {
        map.set(post.platform, post);
      }
    }
    return map;
  }, [posts]);

  const firstAvailable = useMemo(
    () => PLATFORM_ORDER.find(p => postsByPlatform.has(p)) ?? null,
    [postsByPlatform]
  );

  const effectivePlatform =
    activePlatform && postsByPlatform.has(activePlatform) ? activePlatform : firstAvailable;

  const hasAnyPost = postsByPlatform.size > 0;
  const activePost = effectivePlatform ? postsByPlatform.get(effectivePlatform) : null;

  const fadeIn = prefersReducedMotion
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  const staggerChildren = prefersReducedMotion
    ? { animate: {} }
    : { animate: { transition: { staggerChildren: 0.05 } } };

  return (
    <section className="relative bg-slate-950 overflow-hidden border-t border-white/[0.06]">
      {/* Hairline grid overlay matching home hero */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Header */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerChildren}
          className="mb-14 max-w-2xl"
        >
          <motion.div variants={fadeIn}>
            <SectionKicker align="left" tone="white">
              Behind the wheel
            </SectionKicker>
          </motion.div>
          <motion.h2
            variants={fadeIn}
            className="text-4xl sm:text-5xl lg:text-6xl text-white tracking-[-0.025em] leading-[1.02] mb-5"
          >
            Follow our journey.
          </motion.h2>
          <motion.p
            variants={fadeIn}
            className="text-base md:text-lg text-white/55 font-light leading-relaxed"
          >
            Latest from our social channels — click any platform to see what we&apos;re up to.
          </motion.p>
        </motion.div>

        {hasAnyPost ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start">
            {/* Left column: video player */}
            <motion.div
              layout={!prefersReducedMotion}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className={`relative w-full mx-auto bg-black border border-white/10 overflow-hidden ${
                activePlatform && isVertical(activePlatform)
                  ? 'aspect-[9/16] max-w-md lg:max-w-none lg:max-h-[680px]'
                  : 'aspect-video'
              }`}
            >
              <AnimatePresence mode="wait">
                {activePost && (
                  <motion.div
                    key={activePost.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <EmbedCard post={activePost} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right column: platform blocks (desktop vertical, mobile horizontal scroll) */}
            <div className="lg:flex lg:flex-col lg:gap-3 -mx-4 px-4 lg:mx-0 lg:px-0 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none flex gap-3 lg:gap-3">
              {PLATFORM_ORDER.map(platform => {
                const Icon = PLATFORM_ICONS[platform];
                const hasPost = postsByPlatform.has(platform);
                const isActive = activePlatform === platform;

                const sharedClasses =
                  'snap-start shrink-0 w-[280px] lg:w-auto flex items-start gap-4 p-5 border transition-all duration-200 text-left';
                const stateClasses = isActive
                  ? 'border-white/30 bg-white/[0.04]'
                  : 'border-white/10 hover:border-white/25 hover:bg-white/[0.02]';

                const content = (
                  <>
                    <span
                      aria-hidden
                      className={`block w-1 self-stretch transition-colors ${
                        isActive ? 'bg-dpe-green' : 'bg-transparent'
                      }`}
                    />
                    <div
                      className={`flex-shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-white/55'
                      }`}
                    >
                      <Icon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-base font-semibold tracking-tight transition-colors ${
                          isActive ? 'text-white' : 'text-white/80'
                        }`}
                      >
                        {PLATFORM_LABELS[platform]}
                      </div>
                      <div
                        className={`text-sm font-light leading-relaxed mt-1 transition-colors ${
                          isActive ? 'text-white/70' : 'text-white/45'
                        }`}
                      >
                        {hasPost ? PLATFORM_BLURBS[platform] : 'Visit profile →'}
                      </div>
                    </div>
                  </>
                );

                if (!hasPost) {
                  return (
                    <a
                      key={platform}
                      href={PROFILE_URLS[platform]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${sharedClasses} ${stateClasses}`}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setActivePlatform(platform)}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={`Show latest ${PLATFORM_LABELS[platform]} post`}
                    className={`${sharedClasses} ${stateClasses}`}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          // Fallback: no posts at all
          <div className="flex justify-center gap-8 py-16">
            {PLATFORM_ORDER.map(platform => {
              const Icon = PLATFORM_ICONS[platform];
              return (
                <a
                  key={platform}
                  href={PROFILE_URLS[platform]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 text-white hover:text-dpe-green transition-colors duration-200"
                >
                  <Icon />
                  <span className="text-xs font-medium">{PLATFORM_LABELS[platform]}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
