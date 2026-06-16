import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Endpoint TEMPORÁRIO de diagnóstico — remover após confirmar as variáveis
export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    CRM_JWT_SECRET: Boolean(process.env.CRM_JWT_SECRET),
    CRM_JWT_SECRET_LENGTH: process.env.CRM_JWT_SECRET?.length ?? 0,
    NEXT_PUBLIC_SUPABASE_URL_VALUE: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + '...' || 'não definido',
    NODE_ENV: process.env.NODE_ENV,
  })
}
