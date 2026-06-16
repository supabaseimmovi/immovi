import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth-shared'
import { verifyTokenEdge } from '@/lib/auth-edge'

/**
 * Protege todas as rotas /crm/*. Sem sessão válida, redireciona para /login.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const session = token
    ? await verifyTokenEdge(token).catch(() => null)
    : null

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/crm/:path*'],
}
