import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'
import { signToken, COOKIE_NAME, TOKEN_MAX_AGE } from '@/lib/auth'
import { supabaseAdmin, isSupabaseConfigurado } from '@/lib/supabase/server'
import { assertSameOrigin, rateLimit, readJsonLimited } from '@/lib/security'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const csrf = assertSameOrigin(request)
  if (csrf) return csrf

  const limited = rateLimit(request, 'login', 5, 60_000)
  if (limited) return limited

  const parsed = await readJsonLimited<{ email?: string; senha?: string }>(request)
  if ('response' in parsed) return parsed.response
  const body = parsed.data

  const email = (body.email || '').trim().toLowerCase()
  const senha = body.senha || ''

  if (!email || !senha) {
    return NextResponse.json(
      { ok: false, error: 'Informe e-mail e senha.' },
      { status: 400 }
    )
  }

  let autenticado: {
    sub: string
    email: string
    nome?: string
    role?: 'admin' | 'atendente' | 'viewer'
  } | null = null

  if (isSupabaseConfigurado()) {
    const { data: user } = await supabaseAdmin
      .from('crm_users')
      .select('id, email, nome, role, senha_hash, ativo')
      .eq('email', email)
      .eq('ativo', true)
      .maybeSingle()

    if (user?.senha_hash && bcrypt.compareSync(senha, user.senha_hash)) {
      autenticado = {
        sub: user.id,
        email: user.email,
        nome: user.nome ?? undefined,
        role: user.role ?? 'admin',
      }
    }
  }

  if (!autenticado) {
    return NextResponse.json(
      { ok: false, error: 'E-mail ou senha incorretos.' },
      { status: 401 }
    )
  }

  const jti = randomUUID()
  const expiresAt = new Date(Date.now() + TOKEN_MAX_AGE * 1000).toISOString()

  const { error: sessionError } = await supabaseAdmin
    .from('crm_sessions')
    .insert({
      user_id: autenticado.sub,
      jti,
      expires_at: expiresAt,
    })

  if (sessionError) {
    console.error('[api/auth/login] erro ao criar sessão:', sessionError.message)
    return NextResponse.json(
      { ok: false, error: 'Não foi possível iniciar a sessão.' },
      { status: 500 }
    )
  }

  const token = await signToken({ ...autenticado, jti })
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_MAX_AGE,
  })
  return res
}
