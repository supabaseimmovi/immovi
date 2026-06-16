import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigurado } from '@/lib/supabase/server'
import {
  rateLimit,
  readJsonLimited,
  getSafeWebhookUrl,
  postWebhook,
} from '@/lib/security'
import { verifyTurnstile } from '@/lib/turnstile'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function limpar(valor: unknown, max = 500): string {
  if (typeof valor !== 'string') return ''
  return valor.trim().slice(0, max)
}

export async function POST(request: Request) {
  const limited = rateLimit(request, 'widget', 10, 60_000)
  if (limited) return limited

  const parsed = await readJsonLimited<Record<string, unknown>>(request)
  if ('response' in parsed) return parsed.response
  const body = parsed.data

  const nome = limpar(body.nome, 120)
  const whatsapp = limpar(body.whatsapp, 20)
  const mensagem = limpar(body.mensagem, 1000) || null

  const turnstileOk = await verifyTurnstile(body.cf_token as string | undefined)
  if (!turnstileOk) {
    console.warn('[api/leads/widget] Turnstile bloqueou requisição — token ausente ou inválido. IP:', request.headers.get('x-forwarded-for') ?? 'desconhecido')
    return NextResponse.json(
      { ok: false, error: 'Verificação de segurança falhou. Tente novamente.' },
      { status: 403 }
    )
  }

  if (!nome) {
    return NextResponse.json(
      { ok: false, error: 'Nome é obrigatório.' },
      { status: 400 }
    )
  }
  if (whatsapp.replace(/\D/g, '').length < 10) {
    return NextResponse.json(
      { ok: false, error: 'WhatsApp inválido.' },
      { status: 400 }
    )
  }

  if (!isSupabaseConfigurado()) {
    return NextResponse.json(
      { ok: false, error: 'Serviço temporariamente indisponível.' },
      { status: 503 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('leads_immovi')
    .insert({
      nome,
      whatsapp,
      mensagem,
      tipo_atuacao: 'nao_informado',
      situacao_atual: 'nao_informado',
      faturamento_mensal: 'nao_informado',
      principal_necessidade: 'nao_informado',
      status: 'Novo',
      origem: 'widget_whatsapp',
      tags: ['lead_site_immovi', 'widget_whatsapp'],
    })
    .select('id')
    .single()

  if (error) {
    console.error('[api/leads/widget] erro:', error.message)
    return NextResponse.json(
      { ok: false, error: 'Não foi possível registrar sua solicitação.' },
      { status: 500 }
    )
  }

  const webhookUrl = getSafeWebhookUrl()
  if (webhookUrl) {
    postWebhook(webhookUrl, {
      id: data.id,
      nome,
      whatsapp,
      mensagem,
      origem: 'widget_whatsapp',
    }).catch((e) => console.error('[api/leads/widget] webhook falhou:', e))
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 })
}
