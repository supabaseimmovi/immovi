export interface Lead {
  id: string
  nome: string
  whatsapp: string
  email: string | null
  tipo_atuacao: string
  tipo_atuacao_outro: string | null
  situacao_atual: string
  faturamento_mensal: string
  emite_nota: string | null
  quantidade_notas: number | null
  principal_necessidade: string
  mensagem: string | null
  status: string
  origem: string
  tags: string[] | null
  criado_em: string
  atualizado_em: string
}

export interface LeadHistorico {
  id: string
  lead_id: string
  observacao: string | null
  status_anterior: string | null
  status_novo: string | null
  criado_em: string
}
