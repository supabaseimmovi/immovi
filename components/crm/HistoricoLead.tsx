import { Clock, ArrowRight } from 'lucide-react'
import type { LeadHistorico } from '@/lib/types'

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

export default function HistoricoLead({
  historico,
}: {
  historico: LeadHistorico[]
}) {
  if (historico.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-cinzaClaro bg-white px-4 py-6 text-center text-sm text-cinzaMedio">
        Nenhuma movimentação registrada ainda.
      </p>
    )
  }

  return (
    <ol className="space-y-3">
      {historico.map((h) => (
        <li
          key={h.id}
          className="rounded-lg border border-cinzaClaro bg-white p-4"
        >
          <div className="flex items-center gap-1.5 text-xs text-azulAcinzentado">
            <Clock size={13} />
            {formatar(h.criado_em)}
          </div>
          {h.status_novo && (
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-cinzaMedio">
                {h.status_anterior || '—'}
              </span>
              <ArrowRight size={14} className="text-verde" />
              <span className="font-semibold text-azulEscuro">
                {h.status_novo}
              </span>
            </p>
          )}
          {h.observacao && (
            <p className="mt-2 text-sm text-azulEscuro">{h.observacao}</p>
          )}
        </li>
      ))}
    </ol>
  )
}
