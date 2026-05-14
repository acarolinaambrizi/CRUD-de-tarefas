import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST() {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) throw error;

    return NextResponse.json({
      session: data.session,
      user: data.user
    });
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    return NextResponse.json({ error: 'Failed to sign in anonymously' }, { status: 500 });
  }
}