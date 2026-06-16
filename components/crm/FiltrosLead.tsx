'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { Search, X } from 'lucide-react'
import { STATUS_LEAD } from '@/lib/constants'
import { FORM } from '@/lib/content'

export interface FiltrosValores {
  status?: string
  tipo_atuacao?: string
  principal_necessidade?: string
  origem?: string
  q?: string
}

const selectCls =
  'rounded-lg border border-cinzaClaro bg-white px-3 py-2 text-sm text-azulEscuro outline-none focus:border-verde focus:ring-2 focus:ring-verde/20'

export default function FiltrosLead({ valores }: { valores: FiltrosValores }) {
  const router = useRouter()
  const [filtros, setFiltros] = useState<FiltrosValores>(valores)

  function aplicar(novos: FiltrosValores) {
    const params = new URLSearchParams()
    if (novos.q) params.set('q', novos.q)
    if (novos.status) params.set('status', novos.status)
    if (novos.tipo_atuacao) params.set('tipo_atuacao', novos.tipo_atuacao)
    if (novos.principal_necessidade)
      params.set('principal_necessidade', novos.principal_necessidade)
    if (novos.origem) params.set('origem', novos.origem)
    const qs = params.toString()
    router.push(qs ? `/crm/leads?${qs}` : '/crm/leads')
  }

  function onChangeSelect(campo: keyof FiltrosValores, valor: string) {
    const novos = { ...filtros, [campo]: valor || undefined }
    setFiltros(novos)
    aplicar(novos)
  }

  function onBuscar(e: FormEvent) {
    e.preventDefault()
    aplicar(filtros)
  }

  function limpar() {
    setFiltros({})
    router.push('/crm/leads')
  }

  const temFiltro =
    filtros.q ||
    filtros.status ||
    filtros.tipo_atuacao ||
    filtros.principal_necessidade ||
    filtros.origem

  return (
    <div className="rounded-xl border border-cinzaClaro bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={onBuscar} className="relative flex-1 min-w-[220px]">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-azulAcinzentado"
          />
          <input
            type="text"
            value={filtros.q || ''}
            onChange={(e) => setFiltros((f) => ({ ...f, q: e.target.value }))}
            placeholder="Buscar por nome, WhatsApp ou e-mail..."
            className="w-full rounded-lg border border-cinzaClaro bg-white py-2 pl-9 pr-3 text-sm text-azulEscuro outline-none focus:border-verde focus:ring-2 focus:ring-verde/20"
          />
        </form>

        <select
          value={filtros.status || ''}
          onChange={(e) => onChangeSelect('status', e.target.value)}
          className={selectCls}
        >
          <option value="">Todos os status</option>
          {STATUS_LEAD.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={filtros.tipo_atuacao || ''}
          onChange={(e) => onChangeSelect('tipo_atuacao', e.target.value)}
          className={selectCls}
        >
          <option value="">Toda atuação</option>
          {FORM.opcoes.tipoAtuacao.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={filtros.principal_necessidade || ''}
          onChange={(e) => onChangeSelect('principal_necessidade', e.target.value)}
          className={selectCls}
        >
          <option value="">Toda necessidade</option>
          {FORM.opcoes.principalNecessidade.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={filtros.origem || ''}
          onChange={(e) => onChangeSelect('origem', e.target.value)}
          className={selectCls}
        >
          <option value="">Toda origem</option>
          <option value="site_immovi">Formulário do site</option>
          <option value="widget_whatsapp">Caixinha do WhatsApp</option>
        </select>

        {temFiltro && (
          <button
            type="button"
            onClick={limpar}
            className="inline-flex items-center gap-1 rounded-lg border border-cinzaClaro px-3 py-2 text-sm font-medium text-cinzaMedio hover:border-red-300 hover:text-red-600"
          >
            <X size={15} /> Limpar
          </button>
        )}
      </div>
    </div>
  )
}
