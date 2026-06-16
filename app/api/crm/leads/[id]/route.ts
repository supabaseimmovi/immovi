import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/crm-session'
import { supabaseAdmin } from '@/lib/supabase/server'
import { STATUS_LEAD } from '@/lib/constants'
import { assertSameOrigin, isUuid, readJsonLimited } from '@/lib/security'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: Params) {
  const auth = await requireApiRole(['admin', 'atendente', 'viewer'])
  if ('response' in auth) return auth.response

  const { id } = await params

  if (!isUuid(id)) {
    return NextResponse.json({ ok: false, error: 'ID inválido.' }, { status: 400 })
  }

  const { data: lead, error } = await supabaseAdmin
    .from('leads_immovi')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  if (!lead) return NextResponse.json({ ok: false, error: 'Lead não encontrado.' }, { status: 404 })

  const { data: historico } = await supabaseAdmin
    .from('leads_immovi_historico')
    .select('*')
    .eq('lead_id', id)
    .order('criado_em', { ascending: false })

  return NextResponse.json({ ok: true, lead, historico: historico ?? [] })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const csrf = assertSameOrigin(request)
  if (csrf) return csrf

  const auth = await requireApiRole(['admin', 'atendente'])
  if ('response' in auth) return auth.response

  const { id } = await params

  if (!isUuid(id)) {
    return NextResponse.json({ ok: false, error: 'ID inválido.' }, { status: 400 })
  }

  const parsed = await readJsonLimited<{ status?: string; observacao?: string }>(request)
  if ('response' in parsed) return parsed.response
  const body = parsed.data

  const novoStatus = (body.status || '').trim()
  if (!novoStatus || !STATUS_LEAD.includes(novoStatus as (typeof STATUS_LEAD)[number])) {
    return NextResponse.json({ ok: false, error: 'Status inválido.' }, { status: 400 })
  }

  const { data: atual, error: erroAtual } = await supabaseAdmin
    .from('leads_immovi')
    .select('status')
    .eq('id', id)
    .maybeSingle()

  if (erroAtual) return NextResponse.json({ ok: false, error: erroAtual.message }, { status: 500 })
  if (!atual) return NextResponse.json({ ok: false, error: 'Lead não encontrado.' }, { status: 404 })

  const { error: erroUpdate } = await supabaseAdmin
    .from('leads_immovi')
    .update({ status: novoStatus, atualizado_em: new Date().toISOString() })
    .eq('id', id)

  if (erroUpdate) return NextResponse.json({ ok: false, error: erroUpdate.message }, { status: 500 })

  await supabaseAdmin.from('leads_immovi_historico').insert({
    lead_id: id,
    observacao: body.observacao?.trim() || null,
    status_anterior: atual.status as string,
    status_novo: novoStatus,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const csrf = assertSameOrigin(request)
  if (csrf) return csrf

  // Exclusão exige role admin
  const auth = await requireApiRole(['admin'])
  if ('response' in auth) return auth.response

  const { id } = await params

  if (!isUuid(id)) {
    return NextResponse.json({ ok: false, error: 'ID inválido.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('leads_immovi')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
