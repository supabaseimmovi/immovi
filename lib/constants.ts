export const EMPRESA = {
  nome: 'Immovi Contabilidade',
  slogan: 'Especialistas no Ecossistema Imobiliário',
  dominio: (() => {
    const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://immovicontabilidade.com.br'
    return raw.startsWith('http') ? raw : `https://${raw}`
  })(),
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    'https://www.instagram.com/immovicontabilidade',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || 'INSERIR_NUMERO_AQUI',
  email: '',
  enderecos: [
    {
      cidade: 'Sorocaba – SP',
      logradouro: 'Rua Fernando Silva, 190 – Sala 804, Jardim Astro',
    },
  ],
  priceRange: 'R$ 257 - R$ 1.497/mês',
}

export const WHATSAPP_BASE = `https://wa.me/${
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || 'INSERIR_NUMERO_AQUI'
}`

export function whatsappLink(mensagem: string): string {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(mensagem)}`
}

export const MENSAGENS_WHATSAPP = {
  hero: 'Olá! Gostaria de falar com um especialista da Immovi Contabilidade.',
  consultoria:
    'Olá! Gostaria de solicitar uma consultoria gratuita para meu negócio no mercado imobiliário.',
  planStart: 'Olá! Tenho interesse no Plano START da Immovi Contabilidade.',
  planSmart: 'Olá! Tenho interesse no Plano SMART da Immovi Contabilidade.',
  planPerformance:
    'Olá! Tenho interesse no Plano PERFORMANCE da Immovi Contabilidade.',
  aberturaEmpresa:
    'Olá! Quero abrir uma empresa para atuar no mercado imobiliário com apoio da Immovi.',
  trocaContador:
    'Olá! Quero trocar de contador e migrar para a Immovi Contabilidade.',
  planejamentoTributario:
    'Olá! Quero fazer um planejamento tributário para minha empresa do mercado imobiliário.',
  emissaoNotas:
    'Olá! Tenho dúvidas sobre emissão de notas fiscais no mercado imobiliário.',
  organizacaoFinanceira:
    'Olá! Quero organizar melhor a parte financeira da minha PJ.',
  geral: 'Olá! Gostaria de saber mais sobre a Immovi Contabilidade.',
}

export const CORES = {
  verde: '#00D4AA',
  cinzaClaro: '#DADCDF',
  cinzaMedio: '#53606C',
  azulEscuro: '#0A1D2E',
  brancoFrio: '#F8FEFD',
  azulAcinzentado: '#7690A5',
}

export const STATUS_LEAD = [
  'Novo',
  'Em atendimento',
  'Consultoria agendada',
  'Proposta enviada',
  'Aguardando retorno',
  'Convertido',
  'Perdido',
] as const

export type StatusLead = (typeof STATUS_LEAD)[number]
