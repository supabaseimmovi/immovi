import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
  }

  const { error } = await supabaseAdmin
    .from('leads_immovi')
    .select('id', { count: 'exact', head: true })

  if (error) {
    console.error('[cron/ping] Supabase error:', error.message)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  console.log('[cron/ping] Supabase ping OK —', new Date().toISOString())
  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() })
}
