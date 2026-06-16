import 'server-only'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { COOKIE_NAME, verifyToken, type SessionPayload } from './auth'
import type { CrmRole } from './auth-shared'
import { supabaseAdmin, isSupabaseConfigurado } from './supabase/server'

async function getActiveSession(
  session: SessionPayload
): Promise<SessionPayload | null> {
  if (!session.jti) return null
  if (!isSupabaseConfigurado()) return null

  const { data: dbSession, error: sessionError } = await supabaseAdmin
    .from('crm_sessions')
    .select('revoked_at, expires_at')
    .eq('jti', session.jti)
    .eq('user_id', session.sub)
    .maybeSingle()

  if (sessionError || !dbSession) return null
  if (dbSession.revoked_at) return null

  const expiresAt = new Date(dbSession.expires_at as string).getTime()
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null

  const { data: user, error: userError } = await supabaseAdmin
    .from('crm_users')
    .select('email, nome, role, ativo')
    .eq('id', session.sub)
    .eq('ativo', true)
    .maybeSingle()

  if (userError || !user) return null

  const rawRole = user.role
  const role: CrmRole =
    rawRole === 'admin' || rawRole === 'atendente' || rawRole === 'viewer'
      ? rawRole
      : 'viewer'

  return {
    ...session,
    email: String(user.email),
    nome: user.nome ? String(user.nome) : undefined,
    role,
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value
  if (!token) return null
  const session = await verifyToken(token)
  if (!session) return null
  return getActiveSession(session)
}

export async function requireApiSession(): Promise<
  { session: SessionPayload } | { response: NextResponse }
> {
  const session = await getSession()
  if (!session) {
    return {
      response: NextResponse.json(
        { ok: false, error: 'Não autenticado.' },
        { status: 401 }
      ),
    }
  }
  return { session }
}

export async function requireApiRole(
  allowed: CrmRole[]
): Promise<{ session: SessionPayload } | { response: NextResponse }> {
  const auth = await requireApiSession()
  if ('response' in auth) return auth

  const role = auth.session.role ?? 'viewer'
  if (!allowed.includes(role)) {
    return {
      response: NextResponse.json(
        { ok: false, error: 'Permissão insuficiente.' },
        { status: 403 }
      ),
    }
  }

  return auth
}
