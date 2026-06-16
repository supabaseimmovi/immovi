/**
 * Verificação server-side do Cloudflare Turnstile.
 * Retorna true se o token for válido (ou se a chave não estiver configurada — dev local).
 */
export async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (!secret) return true // chave não configurada: ignora em dev
  if (!token || token.trim() === '') return false

  const body = new URLSearchParams({ secret, response: token })

  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: AbortSignal.timeout(5000),
      }
    )
    if (!res.ok) return false
    const data = (await res.json()) as { success: boolean }
    return data.success === true
  } catch {
    return false
  }
}
