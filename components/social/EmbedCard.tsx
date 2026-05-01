'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { SocialPost } from '@/lib/social/types';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: (el?: HTMLElement) => void } };
    FB?: { XFBML: { parse: (el?: HTMLElement) => void } };
  }
}

const PLATFORM_CONFIG = {
  instagram: { color: '#e1306c', label: 'Instagram' },
  facebook: { color: '#1877f2', label: 'Facebook' },
  tiktok: { color: '#010101', label: 'TikTok' },
  youtube: { color: '#ff0000', label: 'YouTube' },
} as const;

// Extract TikTok video ID from the post ID (stored as tt_VIDEO_ID)
function getTikTokVideoId(post: SocialPost): string | null {
  if (post.platform !== 'tiktok') return null;
  const match = post.id.match(/^tt_(\d+)$/);
  return match ? match[1] : null;
}

// Extract YouTube video ID from the post ID (stored as yt_VIDEO_ID)
function getYouTubeVideoId(post: SocialPost): string | null {
  if (post.platform !== 'youtube') return null;
  const match = post.id.match(/^yt_(.+)$/);
  return match ? match[1] : null;
}

// Allowed domains in embed HTML - reject anything from unknown sources
const ALLOWED_EMBED_DOMAINS = [
  'instagram.com',
  'facebook.com',
  'facebook.net',
  'tiktok.com',
  'cdninstagram.com',
  'fbcdn.net',
  'youtube.com',
  'youtube-nocookie.com',
  'ytimg.com',
];

function isEmbedHtmlSafe(html: string): boolean {
  if (/<script(?![^>]*\bsrc=)/i.test(html)) return false;
  if (/\bon\w+\s*=/i.test(html)) return false;
  if (/javascript\s*:/i.test(html)) return false;

  const srcMatches = html.matchAll(/(?:src|href)=["']([^"']+)["']/gi);
  for (const match of srcMatches) {
    try {
      const url = new URL(match[1], 'https://placeholder.invalid');
      if (url.hostname === 'placeholder.invalid') continue;
      const isAllowed = ALLOWED_EMBED_DOMAINS.some(
        domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`)
      );
      if (!isAllowed) return false;
    } catch {
      return false;
    }
  }
  return true;
}

function stripScriptTags(html: string): string {
  return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
}

function reinitEmbed(platform: SocialPost['platform'], container: HTMLElement) {
  if (platform === 'instagram' && window.instgrm?.Embeds) {
    window.instgrm.Embeds.process(container);
  } else if (platform === 'facebook' && window.FB?.XFBML) {
    window.FB.XFBML.parse(container);
  }
}

interface EmbedCardProps {
  post: SocialPost;
}

export function EmbedCard({ post }: EmbedCardProps) {
  const tiktokId = getTikTokVideoId(post);
  const youtubeId = getYouTubeVideoId(post);

  if (post.platform === 'tiktok' && tiktokId) {
    return <TikTokEmbed videoId={tiktokId} caption={post.caption} url={post.url} />;
  }

  if (post.platform === 'youtube' && youtubeId) {
    return <YouTubeEmbed videoId={youtubeId} caption={post.caption} url={post.url} />;
  }

  // Instagram / Facebook: use oEmbed HTML
  return <OEmbedCard post={post} />;
}

// ── TikTok direct iframe embed ──────────────────────────────────────

function TikTokEmbed({ videoId, caption, url }: { videoId: string; caption: string | null; url: string }) {
  const [showCaption, setShowCaption] = useState(false);

  return (
    <div className="h-full">
      <div className="overflow-hidden shadow-lg bg-black h-full border border-slate-200/40">
        <iframe
          src={`https://www.tiktok.com/player/v1/${videoId}?music_info=1&description=0`}
          className="w-full h-full"
          allowFullScreen
          allow="encrypted-media"
          title="TikTok video"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {caption && (
        <div className="mt-3 px-1">
          <button
            type="button"
            onClick={() => setShowCaption(!showCaption)}
            className="text-xs text-dpe-slate hover:text-[#0A1340] transition-colors flex items-center gap-1"
          >
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${showCaption ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showCaption ? 'Hide caption' : 'Show caption'}
          </button>
          {showCaption && (
            <p className="text-sm text-dpe-slate mt-2 leading-relaxed">
              {caption}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-dpe-blue text-xs font-medium hover:underline"
              >
                View on TikTok →
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── YouTube direct iframe embed ─────────────────────────────────────

function YouTubeEmbed({ videoId, caption, url }: { videoId: string; caption: string | null; url: string }) {
  const [showCaption, setShowCaption] = useState(false);

  return (
    <div className="h-full">
      <div className="overflow-hidden shadow-lg bg-black h-full border border-slate-200/40">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="YouTube video"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {caption && (
        <div className="mt-3 px-1">
          <button
            type="button"
            onClick={() => setShowCaption(!showCaption)}
            className="text-xs text-dpe-slate hover:text-[#0A1340] transition-colors flex items-center gap-1"
          >
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${showCaption ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showCaption ? 'Hide caption' : 'Show caption'}
          </button>
          {showCaption && (
            <p className="text-sm text-dpe-slate mt-2 leading-relaxed">
              {caption}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-dpe-blue text-xs font-medium hover:underline"
              >
                View on YouTube →
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── oEmbed-based embed for Instagram / Facebook ─────────────────────

function OEmbedCard({ post }: { post: SocialPost }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current || !post.embed_html) return;
    const timer = setTimeout(() => {
      if (containerRef.current) {
        reinitEmbed(post.platform, containerRef.current);
      }
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [isVisible, post.embed_html, post.platform]);

  if (!post.embed_html || !isEmbedHtmlSafe(post.embed_html)) {
    return <FallbackCard post={post} />;
  }

  const cleanHtml = stripScriptTags(post.embed_html);

  return (
    <div ref={containerRef} className="w-full">
      {!isLoaded && (
        <div className="animate-pulse bg-gray-100 min-h-[400px] flex items-center justify-center border border-slate-200">
          <div className="text-center">
            <div
              className="w-10 h-10 rounded-full mx-auto mb-3"
              style={{ backgroundColor: PLATFORM_CONFIG[post.platform].color + '20' }}
            />
            <p className="text-sm text-gray-400">
              Loading {PLATFORM_CONFIG[post.platform].label} post...
            </p>
          </div>
        </div>
      )}
      {isVisible && (
        <div
          className={isLoaded ? 'opacity-100 transition-opacity duration-500' : 'opacity-0 absolute'}
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      )}
    </div>
  );
}

// ── Fallback link card ──────────────────────────────────────────────

function FallbackCard({ post }: { post: SocialPost }) {
  const config = PLATFORM_CONFIG[post.platform];
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-white/70 backdrop-blur-md border border-white/40 p-8 text-center hover:bg-white/90 hover:shadow-xl transition-all duration-200"
    >
      <div
        className="w-12 h-12 rounded-full mx-auto mb-4"
        style={{ backgroundColor: config.color }}
      />
      <h3 className="text-[#0A1340] mb-2">{config.label}</h3>
      {post.caption && (
        <p className="text-sm text-dpe-slate mb-4 line-clamp-2">{post.caption}</p>
      )}
      <span className="text-dpe-blue font-medium text-sm">View post →</span>
    </a>
  );
}
