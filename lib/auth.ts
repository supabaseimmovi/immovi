import { randomUUID } from 'crypto'
import { SignJWT, jwtVerify } from 'jose'
import {
  COOKIE_NAME,
  TOKEN_AUDIENCE,
  TOKEN_ISSUER,
  TOKEN_MAX_AGE,
  getSecretString,
  type CrmRole,
  type SessionPayload,
} from './auth-shared'

export { COOKIE_NAME, TOKEN_MAX_AGE }
export type { SessionPayload }

function getSecret(): Uint8Array {
  return new TextEncoder().encode(getSecretString())
}

export async function signToken(payload: SessionPayload): Promise<string> {
  const jti = payload.jti ?? randomUUID()

  return new SignJWT({
    email: payload.email,
    nome: payload.nome,
    role: payload.role ?? 'viewer',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .setSubject(payload.sub)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_MAX_AGE}s`)
    .sign(getSecret())
}

export async function verifyToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    })

    const sub = typeof payload.sub === 'string' ? payload.sub : ''
    const email = typeof payload.email === 'string' ? payload.email : ''
    const jti = typeof payload.jti === 'string' ? payload.jti : ''
    if (!sub || !email || !jti) return null

    const rawRole = payload.role
    const role: CrmRole =
      rawRole === 'admin' || rawRole === 'atendente' || rawRole === 'viewer'
        ? rawRole
        : 'viewer'

    return {
      sub,
      email,
      nome: typeof payload.nome === 'string' ? payload.nome : undefined,
      role,
      jti,
    }
  } catch {
    return null
  }
}
