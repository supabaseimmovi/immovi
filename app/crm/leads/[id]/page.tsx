import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getLeadComHistorico } from '@/lib/crm-data'
import { COR_STATUS } from '@/lib/labels'
import LeadDetalhe from '@/components/crm/LeadDetalhe'
import HistoricoLead from '@/components/crm/HistoricoLead'

export const dynamic = 'force-dynamic'

function formatar(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    })
  } catch {
    return iso
  }
}

export default async function LeadDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { lead, historico } = await getLeadComHistorico(id)
  if (!lead) notFound()

  return (
    <div>
      <Link
        href="/crm/leads"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-cinzaMedio hover:text-azulEscuro"
      >
        <ArrowLeft size={16} /> Voltar para leads
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold text-azulEscuro">{lead.nome}</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            COR_STATUS[lead.status] || 'bg-cinzaClaro text-cinzaMedio'
          }`}
        >
          {lead.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-azulAcinzentado">
        Recebido em {formatar(lead.criado_em)}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LeadDetalhe lead={lead} />
        </div>
        <aside className="lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cinzaMedio">
            Histórico
          </h2>
          <div className="mt-3">
            <HistoricoLead historico={historico} />
          </div>
        </aside>
      </div>
    </div>
  )
}
