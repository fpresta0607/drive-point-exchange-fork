import { NextResponse } from 'next/server';
import { createBrowserClient } from '@/lib/supabase';

export const revalidate = 3600;

export async function GET() {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('social_posts')
      .select('id, platform, url, thumbnail, caption, embed_html, posted_at')
      .order('posted_at', { ascending: false })
      .limit(9);

    if (error) throw error;

    return NextResponse.json({ posts: data || [] });
  } catch (err) {
    console.error('[social/feed] Error fetching posts:', err);
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}
