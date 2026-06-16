import { NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/crm-session'
import { supabaseAdmin } from '@/lib/supabase/server'
import { assertSameOrigin, isUuid, readJsonLimited } from '@/lib/security'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const csrf = assertSameOrigin(request)
  if (csrf) return csrf

  const auth = await requireApiRole(['admin', 'atendente'])
  if ('response' in auth) return auth.response

  const parsed = await readJsonLimited<{ lead_id?: string; observacao?: string }>(request)
  if ('response' in parsed) return parsed.response
  const body = parsed.data

  const leadId = (body.lead_id || '').trim()
  const observacao = (body.observacao || '').trim()

  if (!leadId || !isUuid(leadId)) {
    return NextResponse.json(
      { ok: false, error: 'lead_id inválido.' },
      { status: 400 }
    )
  }
  if (!observacao) {
    return NextResponse.json(
      { ok: false, error: 'A observação não pode ser vazia.' },
      { status: 400 }
    )
  }

  const { error } = await supabaseAdmin.from('leads_immovi_historico').insert({
    lead_id: leadId,
    observacao: observacao.slice(0, 2000),
  })

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}
