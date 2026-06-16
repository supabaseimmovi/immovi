import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Endpoint TEMPORÁRIO de diagnóstico — remover após confirmar as variáveis
export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    CRM_JWT_SECRET: Boolean(process.env.CRM_JWT_SECRET),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
    TURNSTILE_SECRET_KEY: Boolean(process.env.TURNSTILE_SECRET_KEY),
    NODE_ENV: process.env.NODE_ENV,
  })
}
