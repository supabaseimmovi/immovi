import 'server-only'
import { supabaseAdmin, isSupabaseConfigurado } from './supabase/server'
import { STATUS_LEAD } from './constants'
import { safeSearch } from './security'
import type { Lead, LeadHistorico } from './types'

const POR_PAGINA = 20

export interface DashboardStats {
  total: number
  porStatus: Record<string, number>
  porTipo: Record<string, number>
  porOrigem: Record<string, number>
  convertidos: number
  taxaConversao: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const vazio: DashboardStats = {
    total: 0,
    porStatus: Object.fromEntries(STATUS_LEAD.map((s) => [s, 0])),
    porTipo: {},
    porOrigem: {},
    convertidos: 0,
    taxaConversao: 0,
  }
  if (!isSupabaseConfigurado()) return vazio

  const { data, error } = await supabaseAdmin
    .from('leads_immovi')
    .select('status, tipo_atuacao, origem')

  if (error || !data) return vazio

  const stats = { ...vazio, porStatus: { ...vazio.porStatus }, porTipo: {}, porOrigem: {} } as DashboardStats
  stats.total = data.length
  for (const row of data) {
    const st = row.status || 'Novo'
    stats.porStatus[st] = (stats.porStatus[st] || 0) + 1
    const tp = row.tipo_atuacao || 'outro'
    stats.porTipo[tp] = (stats.porTipo[tp] || 0) + 1
    const og = row.origem || 'site_immovi'
    stats.porOrigem[og] = (stats.porOrigem[og] || 0) + 1
  }
  stats.convertidos = stats.porStatus['Convertido'] || 0
  stats.taxaConversao = stats.total > 0 ? (stats.convertidos / stats.total) * 100 : 0
  return stats
}

export interface LeadsFiltro {
  status?: string
  tipo_atuacao?: string
  principal_necessidade?: string
  origem?: string
  q?: string
  page?: number
}

export interface LeadsResultado {
  leads: Lead[]
  total: number
  pagina: number
  paginas: number
}

export async function getLeadsList(filtro: LeadsFiltro): Promise<LeadsResultado> {
  const pagina = Math.max(1, filtro.page || 1)
  if (!isSupabaseConfigurado()) {
    return { leads: [], total: 0, pagina, paginas: 0 }
  }

  let query = supabaseAdmin
    .from('leads_immovi')
    .select('*', { count: 'exact' })
    .order('criado_em', { ascending: false })

  if (filtro.status) query = query.eq('status', filtro.status)
  if (filtro.tipo_atuacao) query = query.eq('tipo_atuacao', filtro.tipo_atuacao)
  if (filtro.principal_necessidade)
    query = query.eq('principal_necessidade', filtro.principal_necessidade)
  if (filtro.origem) query = query.eq('origem', filtro.origem)
  if (filtro.q) {
    const q = safeSearch(filtro.q)
    if (q) {
      query = query.or(`nome.ilike.%${q}%,whatsapp.ilike.%${q}%,email.ilike.%${q}%`)
    }
  }

  const from = (pagina - 1) * POR_PAGINA
  query = query.range(from, from + POR_PAGINA - 1)

  const { data, count } = await query
  const total = count ?? 0
  return {
    leads: (data as Lead[]) ?? [],
    total,
    pagina,
    paginas: Math.ceil(total / POR_PAGINA),
  }
}

export async function getLeadComHistorico(
  id: string
): Promise<{ lead: Lead | null; historico: LeadHistorico[] }> {
  if (!isSupabaseConfigurado()) return { lead: null, historico: [] }

  const { data: lead } = await supabaseAdmin
    .from('leads_immovi')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!lead) return { lead: null, historico: [] }

  const { data: historico } = await supabaseAdmin
    .from('leads_immovi_historico')
    .select('*')
    .eq('lead_id', id)
    .order('criado_em', { ascending: false })

  return { lead: lead as Lead, historico: (historico as LeadHistorico[]) ?? [] }
}
