import {
  TOKEN_AUDIENCE,
  TOKEN_ISSUER,
  getSecretString,
  type SessionPayload,
  type CrmRole,
} from './auth-shared'

/**
 * Verificação de JWT HS256 usando apenas Web Crypto — compatível com Edge
 * (middleware) sem importar o jose. Valida assinatura, algoritmo e expiração.
 */

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  return buffer
}

function base64UrlToBuffer(input: string): ArrayBuffer {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

function decodeJson(segment: string): Record<string, unknown> | null {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlToBuffer(segment)))
  } catch {
    return null
  }
}

export async function verifyTokenEdge(
  token: string
): Promise<SessionPayload | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [headerB64, payloadB64, signatureB64] = parts

  const header = decodeJson(headerB64)
  if (!header || header.alg !== 'HS256') return null

  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    toArrayBuffer(enc.encode(getSecretString())),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const valido = await crypto.subtle.verify(
    'HMAC',
    key,
    base64UrlToBuffer(signatureB64),
    toArrayBuffer(enc.encode(`${headerB64}.${payloadB64}`))
  )
  if (!valido) return null

  const payload = decodeJson(payloadB64)
  if (!payload) return null

  if (typeof payload.exp !== 'number' || Date.now() / 1000 > payload.exp) {
    return null
  }
  if (payload.iss !== TOKEN_ISSUER) return null
  if (payload.aud !== TOKEN_AUDIENCE) return null

  const sub = String(payload.sub ?? '')
  const email = String(payload.email ?? '')
  const jti = String(payload.jti ?? '')
  if (!sub || !email || !jti) return null

  const rawRole = payload.role
  const role: CrmRole =
    rawRole === 'admin' || rawRole === 'atendente' || rawRole === 'viewer'
      ? rawRole
      : 'viewer'

  return {
    sub,
    email,
    nome: payload.nome ? String(payload.nome) : undefined,
    role,
    jti,
  }
}
