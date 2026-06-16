import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME, verifyToken } from '@/lib/auth'
import { assertSameOrigin } from '@/lib/security'
import { supabaseAdmin, isSupabaseConfigurado } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const csrf = assertSameOrigin(request)
  if (csrf) return csrf

  const token = (await cookies()).get(COOKIE_NAME)?.value
  if (token && isSupabaseConfigurado()) {
    const session = await verifyToken(token)
    if (session?.jti) {
      await supabaseAdmin
        .from('crm_sessions')
        .update({ revoked_at: new Date().toISOString() })
        .eq('jti', session.jti)
        .eq('user_id', session.sub)
    }
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}
