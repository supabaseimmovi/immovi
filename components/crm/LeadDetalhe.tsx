'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MessageCircle,
  Loader2,
  Trash2,
  Save,
  Plus,
  AlertCircle,
  Mail,
  Phone,
  Clock,
} from 'lucide-react'
import type { Lead } from '@/lib/types'
import { STATUS_LEAD } from '@/lib/constants'
import {
  rotulo,
  LABEL_TIPO_ATUACAO,
  LABEL_SITUACAO_ATUAL,
  LABEL_FATURAMENTO,
  LABEL_EMITE_NOTA,
  LABEL_NECESSIDADE,
} from '@/lib/labels'

function formatarData(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(iso))
}

function whatsappDoLead(numero: string, nome: string): string {
  const d = numero.replace(/\D/g, '')
  const comDDI = d.startsWith('55') ? d : `55${d}`
  const msg = `Olá, ${nome}! Tudo bem? Aqui é a equipe da Immovi Contabilidade. Recebemos seu interesse em nossos serviços e gostaríamos de conversar sobre como podemos ajudar no seu negócio. Quando teria disponibilidade para uma conversa rápida?`
  return `https://wa.me/${comDDI}?text=${encodeURIComponent(msg)}`
}

export default function LeadDetalhe({ lead }: { lead: Lead }) {
  const router = useRouter()
  const [status, setStatus] = useState(lead.status)
  const [obsStatus, setObsStatus] = useState('')
  const [novaObs, setNovaObs] = useState('')
  const [salvandoStatus, setSalvandoStatus] = useState(false)
  const [salvandoObs, setSalvandoObs] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function salvarStatus() {
    if (salvandoStatus || status === lead.status && !obsStatus.trim()) return
    setErro(null)
    setSalvandoStatus(true)
    try {
      const res = await fetch(`/api/crm/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, observacao: obsStatus.trim() || undefined }),
      })
      if (!res.ok) throw new Error()
      setObsStatus('')
      router.refresh()
    } catch {
      setErro('Não foi possível atualizar o status.')
    } finally {
      setSalvandoStatus(false)
    }
  }

  async function adicionarObs() {
    if (salvandoObs || !novaObs.trim()) return
    setErro(null)
    setSalvandoObs(true)
    try {
      const res = await fetch('/api/crm/historico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: lead.id, observacao: novaObs.trim() }),
      })
      if (!res.ok) throw new Error()
      setNovaObs('')
      router.refresh()
    } catch {
      setErro('Não foi possível adicionar a observação.')
    } finally {
      setSalvandoObs(false)
    }
  }

  async function excluir() {
    setExcluindo(true)
    try {
      const res = await fetch(`/api/crm/leads/${lead.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      router.replace('/crm/leads')
      router.refresh()
    } catch {
      setErro('Não foi possível excluir o lead.')
      setExcluindo(false)
    }
  }

  const campos: { label: string; valor: string }[] = [
    { label: 'Tipo de atuação', valor: rotulo(LABEL_TIPO_ATUACAO, lead.tipo_atuacao) },
    ...(lead.tipo_atuacao_outro
      ? [{ label: 'Atuação (outro)', valor: lead.tipo_atuacao_outro }]
      : []),
    { label: 'Situação atual', valor: rotulo(LABEL_SITUACAO_ATUAL, lead.situacao_atual) },
    { label: 'Faturamento mensal', valor: rotulo(LABEL_FATURAMENTO, lead.faturamento_mensal) },
    { label: 'Emite nota', valor: rotulo(LABEL_EMITE_NOTA, lead.emite_nota) },
    ...(lead.quantidade_notas != null
      ? [{ label: 'Qtd. notas/mês', valor: String(lead.quantidade_notas) }]
      : []),
    { label: 'Necessidade', valor: rotulo(LABEL_NECESSIDADE, lead.principal_necessidade) },
    { label: 'Origem', valor: lead.origem },
  ]

  return (
    <div className="space-y-6">
      {erro && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {erro}
        </div>
      )}

      {/* Contato */}
      <div className="rounded-xl border border-cinzaClaro bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-cinzaMedio">
          Contato
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm text-azulEscuro">
            <Phone size={15} className="text-verde" /> {lead.whatsapp}
          </span>
          {lead.email && (
            <span className="inline-flex items-center gap-1.5 text-sm text-azulEscuro">
              <Mail size={15} className="text-verde" /> {lead.email}
            </span>
          )}
        </div>
        <a
          href={whatsappDoLead(lead.whatsapp, lead.nome)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-verde px-5 py-2.5 text-sm font-semibold text-azulEscuro transition-transform hover:scale-[1.03]"
        >
          <MessageCircle size={16} /> Abrir WhatsApp do lead
        </a>
      </div>

      {/* Dados */}
      <div className="rounded-xl border border-cinzaClaro bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cinzaMedio">
            Dados da solicitação
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-azulAcinzentado">
            <Clock size={13} />
            {formatarData(lead.criado_em)}
          </span>
        </div>
        <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {campos.map((c) => (
            <div key={c.label}>
              <dt className="text-xs text-azulAcinzentado">{c.label}</dt>
              <dd className="text-sm font-medium text-azulEscuro">{c.valor}</dd>
            </div>
          ))}
        </dl>
        {lead.mensagem && (
          <div className="mt-4 rounded-lg bg-[#eef2f4] p-3">
            <p className="text-xs text-azulAcinzentado">Mensagem</p>
            <p className="mt-1 text-sm text-azulEscuro">{lead.mensagem}</p>
          </div>
        )}
        {lead.tags && lead.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {lead.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-azulEscuro/5 px-2.5 py-1 text-xs font-medium text-azulEscuro"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="rounded-xl border border-cinzaClaro bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-cinzaMedio">
          Alterar status
        </h2>
        <div className="mt-3 space-y-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-cinzaClaro bg-white px-3 py-2.5 text-sm text-azulEscuro outline-none focus:border-verde focus:ring-2 focus:ring-verde/20"
          >
            {STATUS_LEAD.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={obsStatus}
            onChange={(e) => setObsStatus(e.target.value)}
            placeholder="Observação sobre a mudança (opcional)"
            className="w-full rounded-lg border border-cinzaClaro bg-white px-3 py-2.5 text-sm text-azulEscuro outline-none focus:border-verde focus:ring-2 focus:ring-verde/20"
          />
          <button
            type="button"
            onClick={salvarStatus}
            disabled={salvandoStatus}
            className="inline-flex items-center gap-2 rounded-full bg-azulEscuro px-5 py-2.5 text-sm font-semibold text-brancoFrio transition-transform hover:scale-[1.03] disabled:opacity-60"
          >
            {salvandoStatus ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Salvar status
          </button>
        </div>
      </div>

      {/* Nova observação */}
      <div className="rounded-xl border border-cinzaClaro bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-cinzaMedio">
          Adicionar observação
        </h2>
        <textarea
          value={novaObs}
          onChange={(e) => setNovaObs(e.target.value)}
          rows={3}
          placeholder="Registre uma observação no histórico do lead..."
          className="mt-3 w-full resize-none rounded-lg border border-cinzaClaro bg-white px-3 py-2.5 text-sm text-azulEscuro outline-none focus:border-verde focus:ring-2 focus:ring-verde/20"
        />
        <button
          type="button"
          onClick={adicionarObs}
          disabled={salvandoObs || !novaObs.trim()}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-azulEscuro px-5 py-2.5 text-sm font-semibold text-azulEscuro transition-colors hover:bg-azulEscuro hover:text-brancoFrio disabled:opacity-50"
        >
          {salvandoObs ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          Adicionar
        </button>
      </div>

      {/* Excluir */}
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-red-700">
          Zona de risco
        </h2>
        {!confirmando ? (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
          >
            <Trash2 size={16} /> Excluir lead
          </button>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-red-700">
              Tem certeza? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={excluir}
                disabled={excluindo}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {excluindo ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Confirmar exclusão
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="rounded-full border border-cinzaClaro px-5 py-2.5 text-sm font-semibold text-cinzaMedio hover:bg-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
