import Link from 'next/link'
import { Phone, Clock, ArrowRight, FileText, MessageCircle } from 'lucide-react'
import type { Lead } from '@/lib/types'
import {
  COR_STATUS,
  rotulo,
  LABEL_TIPO_ATUACAO,
  LABEL_NECESSIDADE,
} from '@/lib/labels'

const ORIGEM_CONFIG: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  site_immovi: {
    label: 'Formulário do site',
    icon: <FileText size={11} />,
    cls: 'bg-azulAcinzentado/15 text-azulEscuro',
  },
  widget_whatsapp: {
    label: 'Caixinha do WhatsApp',
    icon: <MessageCircle size={11} />,
    cls: 'bg-verde/15 text-verde',
  },
}

function formatarData(iso: string): string {
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

export default function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Link
      href={`/crm/leads/${lead.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-cinzaClaro bg-white p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-azulEscuro">{lead.nome}</h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              COR_STATUS[lead.status] || 'bg-cinzaClaro text-cinzaMedio'
            }`}
          >
            {lead.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-cinzaMedio">
          {rotulo(LABEL_TIPO_ATUACAO, lead.tipo_atuacao)}
          {' · '}
          {rotulo(LABEL_NECESSIDADE, lead.principal_necessidade)}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-azulAcinzentado">
          <span className="inline-flex items-center gap-1">
            <Phone size={13} /> {lead.whatsapp}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={13} /> {formatarData(lead.criado_em)}
          </span>
          {ORIGEM_CONFIG[lead.origem] && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${ORIGEM_CONFIG[lead.origem].cls}`}
            >
              {ORIGEM_CONFIG[lead.origem].icon}
              {ORIGEM_CONFIG[lead.origem].label}
            </span>
          )}
        </div>
      </div>
      <ArrowRight
        size={18}
        className="hidden shrink-0 text-azulAcinzentado transition-transform group-hover:translate-x-1 group-hover:text-verde sm:block"
      />
    </Link>
  )
}
