import type { MENSAGENS_WHATSAPP } from './constants'

export type WhatsAppKey = keyof typeof MENSAGENS_WHATSAPP

/* ----------------------------- NAVEGAÇÃO ----------------------------- */

export const NAV_ITEMS = [
  { label: 'Início', href: '/#inicio' },
  { label: 'Para quem é', href: '/#segmentos' },
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Planos', href: '/#planos' },
  { label: 'Dúvidas frequentes', href: '/#faq' },
  { label: 'Consultoria gratuita', href: '/#consultoria' },
  { label: 'Contato', href: '/#contato' },
]

/* -------------------------------- HERO ------------------------------- */

export const HERO = {
  h1: 'Contabilidade Digital para o Ecossistema Imobiliário',
  subheadline:
    'A Immovi ajuda corretores, imobiliárias, arquitetos, engenheiros, designers, correspondentes bancários e advogados imobiliários a organizarem sua contabilidade, reduzirem riscos fiscais e tomarem decisões com mais segurança.',
  ctaPrimario: { label: 'Solicitar Consultoria Gratuita', href: '#consultoria' },
  ctaSecundario: { label: 'Falar com Especialista', whatsappKey: 'hero' as WhatsAppKey },
}

/* ------------------------------- DORES ------------------------------- */

export const DORES = {
  titulo: 'Seu negócio imobiliário enfrenta algum desses problemas?',
  itens: [
    'Você mistura suas contas pessoais com as contas da empresa?',
    'Tem dúvidas sobre emissão de nota fiscal para comissões, projetos ou serviços?',
    'Não sabe se está pagando imposto acima do necessário?',
    'Seu contador não entende as particularidades do mercado imobiliário?',
    'Você atua como PJ, mas não tem organização financeira clara?',
    'Tem dificuldade para controlar faturamento, contratos e obrigações fiscais?',
    'Quer abrir uma empresa para atuar no mercado imobiliário com segurança?',
    'Precisa trocar de contador sem gerar dor de cabeça?',
    'Quer crescer sem correr riscos fiscais e tributários?',
  ],
  cta: { label: 'Quero uma Consultoria Gratuita', href: '#consultoria' },
}

/* ---------------------------- DIFERENCIAIS --------------------------- */

export const DIFERENCIAIS = {
  titulo: 'Nossos Diferenciais',
  subtitulo:
    'Tudo que você precisa para ter controle, segurança e clareza na contabilidade do seu negócio imobiliário.',
  itens: [
    {
      titulo: 'Especialistas no ecossistema imobiliário',
      descricao:
        'Entendemos a rotina de corretores, imobiliárias, arquitetos, engenheiros, designers e profissionais do setor.',
    },
    {
      titulo: 'Atendimento digital e humanizado',
      descricao: 'Processo simples, rápido e com suporte próximo.',
    },
    {
      titulo: 'Planejamento tributário',
      descricao:
        'Análise para buscar o melhor enquadramento e reduzir riscos fiscais.',
    },
    {
      titulo: 'Organização da PJ',
      descricao: 'Apoio para separar pessoa física e pessoa jurídica.',
    },
    {
      titulo: 'Emissão e orientação sobre notas fiscais',
      descricao:
        'Direcionamento para notas de comissões, honorários, projetos, laudos e serviços técnicos.',
    },
    {
      titulo: 'Análise mensal do faturamento',
      descricao:
        'Acompanhamento para manter sua empresa organizada e segura.',
    },
    {
      titulo: 'Apoio para abertura e regularização',
      descricao: 'Estruturação correta desde o início.',
    },
    {
      titulo: 'Suporte para troca de contador',
      descricao: 'Migração organizada, com análise de pendências.',
    },
    {
      titulo: 'Gestão de documentos',
      descricao:
        'Organização contábil, fiscal e financeira em ambiente digital.',
    },
    {
      titulo: 'Tecnologia e controle',
      descricao:
        'Estrutura preparada para plataforma digital, CRM e acompanhamento de leads.',
    },
  ],
}

/* ----------------------------- SEGMENTOS ----------------------------- */

export const SEGMENTOS = {
  titulo: 'Atendemos profissionais e empresas do mercado imobiliário',
  subtitulo:
    'Soluções contábeis pensadas para cada perfil do ecossistema imobiliário.',
  itens: [
    { nome: 'Corretores de imóveis PJ', href: '/contabilidade-para-corretores-de-imoveis' },
    { nome: 'Imobiliárias', href: '/contabilidade-para-imobiliarias' },
    { nome: 'Arquitetos', href: '/contabilidade-para-arquitetos' },
    { nome: 'Designers de interiores', href: '/contabilidade-para-designers-de-interiores' },
    { nome: 'Engenheiros PJ', href: '/contabilidade-para-engenheiros' },
    { nome: 'Advogados imobiliários', href: '/contabilidade-para-advogados-imobiliarios' },
    {
      nome: 'Correspondentes bancários imobiliários',
      href: '/contabilidade-para-correspondentes-bancarios-imobiliarios',
    },
    { nome: 'Construtoras e incorporadoras', href: '/contabilidade-para-construtoras' },
  ],
}

/* ------------------------------ SERVIÇOS ----------------------------- */

export const SERVICOS = {
  titulo: 'Soluções contábeis para o mercado imobiliário',
  subtitulo:
    'Da abertura da empresa ao planejamento tributário, cuidamos da parte contábil para você focar no crescimento do seu negócio.',
  itens: [
    {
      titulo: 'Abertura de empresa',
      descricao:
        'Abra sua PJ para atuar no mercado imobiliário com o enquadramento correto desde o início. A Immovi orienta corretores, arquitetos, engenheiros, designers e outros profissionais na estruturação da empresa com segurança fiscal e contábil.',
      whatsappKey: 'aberturaEmpresa' as WhatsAppKey,
    },
    {
      titulo: 'Troca de contador',
      descricao:
        'Trocar de contador pode ser simples quando existe organização. Fazemos a análise da situação atual, levantamento de pendências e transição para uma contabilidade especializada no mercado imobiliário.',
      whatsappKey: 'trocaContador' as WhatsAppKey,
    },
    {
      titulo: 'Contabilidade mensal especializada',
      descricao:
        'Cuidamos das obrigações contábeis, fiscais e tributárias da sua empresa com foco nas particularidades do setor imobiliário.',
      whatsappKey: 'geral' as WhatsAppKey,
    },
    {
      titulo: 'Planejamento tributário',
      descricao:
        'Analisamos seu faturamento, atividade e regime tributário para buscar uma estrutura mais eficiente, segura e adequada ao seu negócio imobiliário.',
      whatsappKey: 'planejamentoTributario' as WhatsAppKey,
    },
    {
      titulo: 'Emissão e organização de notas fiscais',
      descricao:
        'Orientamos a emissão correta de notas fiscais para comissões, serviços, honorários, projetos, laudos, consultorias e atividades técnicas.',
      whatsappKey: 'emissaoNotas' as WhatsAppKey,
    },
    {
      titulo: 'Organização financeira da PJ',
      descricao:
        'Ajudamos a separar pessoa física e jurídica, organizar receitas, despesas, documentos e melhorar a visão financeira da empresa.',
      whatsappKey: 'organizacaoFinanceira' as WhatsAppKey,
    },
  ],
}

/* ------------------------------ JORNADA ------------------------------ */

export const JORNADA = {
  titulo: 'Como funciona nossa consultoria contábil',
  subtitulo:
    'Do diagnóstico à gestão contínua: um processo simples para organizar sua empresa imobiliária.',
  etapas: [
    {
      numero: 1,
      titulo: 'Diagnóstico inicial',
      descricao:
        'Entendemos sua atividade, situação atual, faturamento, tipo de empresa e principais dificuldades.',
    },
    {
      numero: 2,
      titulo: 'Planejamento e documentação',
      descricao:
        'Definimos o melhor caminho: abertura, regularização, troca de contador, planejamento tributário ou organização financeira.',
    },
    {
      numero: 3,
      titulo: 'Regularização e implantação',
      descricao:
        'Organizamos documentos, obrigações, enquadramento e processos para sua empresa operar com segurança.',
    },
    {
      numero: 4,
      titulo: 'Gestão contábil contínua',
      descricao:
        'Você passa a contar com acompanhamento contábil digital, suporte especializado e visão mais clara da sua empresa.',
    },
  ],
}

/* ----------------------------- TECNOLOGIA ---------------------------- */

export const TECNOLOGIA = {
  titulo: 'Tecnologia e gestão digital para sua contabilidade',
  subtitulo:
    'A Immovi conecta contabilidade, inteligência financeira e tecnologia para apoiar profissionais e empresas do mercado imobiliário.',
  cards: [
    'Gestão contábil digital',
    'Organização financeira',
    'Atendimento consultivo',
    'Relatórios e acompanhamento',
  ],
}

/* ------------------------------- PLANOS ------------------------------ */

export type PlanoNivel = 'START' | 'SMART' | 'PERFORMANCE'

export interface Plano {
  nivel: PlanoNivel
  preco: string
  resumo: string
  destaque?: boolean
  badge?: string
  itens: string[]
  whatsappKey: WhatsAppKey
}

export const PLANOS = {
  titulo: 'Escolha o plano ideal para sua empresa',
  subtitulo:
    'Planos pensados para diferentes fases de profissionais do mercado imobiliário.',
  profissionais: [
    {
      nivel: 'START',
      preco: 'R$ 257/mês',
      resumo: 'Para quem está começando ou quer organizar a PJ',
      whatsappKey: 'planStart',
      itens: [
        'Até 5 notas fiscais/mês',
        'Pró-labore até 2 sócios',
        'Faturamento até R$ 250k/ano',
        'Folha de pagamento à parte',
        'Todos os benefícios inclusos',
      ],
    },
    {
      nivel: 'SMART',
      preco: 'R$ 387/mês',
      resumo: 'Para quem já possui operação ativa',
      destaque: true,
      badge: 'Mais escolhido',
      whatsappKey: 'planSmart',
      itens: [
        'Tudo do Plano START',
        'Até 10 notas fiscais/mês',
        'Pró-labore até 3 sócios',
        'Relatórios contábeis trimestrais',
        'Entrega de CNDs',
        'Faturamento até R$ 720k/ano',
        'Folha de pagamento à parte',
      ],
    },
    {
      nivel: 'PERFORMANCE',
      preco: 'R$ 697/mês',
      resumo: 'Para volume maior de documentos e demandas',
      whatsappKey: 'planPerformance',
      itens: [
        'Tudo do Plano SMART',
        'Até 20 notas fiscais/mês',
        'Pró-labore até 4 sócios',
        'Relatórios contábeis mensais',
        'Pesquisa de situação fiscal',
        'Folha até 5 funcionários',
        'Faturamento até R$ 1.8M/ano',
      ],
    },
  ] as Plano[],
}

/* -------------------------------- FAQ -------------------------------- */

export const FAQ = {
  titulo: 'Dúvidas frequentes sobre contabilidade para o mercado imobiliário',
  itens: [
    {
      pergunta: 'Corretor de imóveis precisa ter CNPJ?',
      resposta:
        'Não é obrigatório, mas atuar como PJ costuma trazer vantagens fiscais e de organização. Como corretor PJ, você pode emitir notas fiscais das comissões, reduzir a carga tributária em relação à pessoa física e separar suas finanças pessoais das da empresa. A Immovi analisa seu caso para indicar o melhor caminho.',
    },
    {
      pergunta: 'Corretor de imóveis pode ser MEI?',
      resposta:
        'A atividade de corretagem de imóveis não está na lista de ocupações permitidas para o MEI. Por isso, corretores que desejam atuar como PJ normalmente abrem a empresa em outro formato, como o Simples Nacional. A Immovi orienta o enquadramento correto desde a abertura.',
    },
    {
      pergunta: 'Qual o melhor regime tributário para corretor de imóveis?',
      resposta:
        'Depende do faturamento, das despesas e da forma de atuação. Em muitos casos o Simples Nacional é vantajoso, mas o Lucro Presumido pode fazer sentido em determinados cenários. Fazemos uma análise tributária para buscar a opção mais eficiente e segura para o seu caso.',
    },
    {
      pergunta: 'Imobiliária precisa de contabilidade especializada?',
      resposta:
        'Sim. Imobiliárias lidam com locação, venda, comissões, repasses e obrigações fiscais específicas. Uma contabilidade que entende o setor ajuda a organizar o financeiro, reduzir riscos e manter a empresa em conformidade.',
    },
    {
      pergunta: 'Arquiteto PJ pode pagar menos imposto com Fator R?',
      resposta:
        'Sim. O Fator R pode permitir que serviços de arquitetura sejam tributados no Anexo III do Simples Nacional, com alíquotas menores, quando a folha de pagamento representa pelo menos 28% do faturamento. Analisamos sua realidade para verificar se essa estratégia se aplica.',
    },
    {
      pergunta: 'Engenheiro PJ precisa emitir nota fiscal?',
      resposta:
        'Sim. Serviços de engenharia, como projetos, laudos, ART e acompanhamento de obras, devem ser faturados com nota fiscal. Orientamos a emissão correta de acordo com a sua atividade e o regime tributário da empresa.',
    },
    {
      pergunta:
        'Designer de interiores precisa separar serviço e produto na contabilidade?',
      resposta:
        'Sim. Quando há venda de produtos além da prestação de serviço de projeto, é importante separar corretamente as receitas, pois a tributação pode ser diferente. Ajudamos a organizar essa separação para evitar erros fiscais.',
    },
    {
      pergunta:
        'Como separar pessoa física e pessoa jurídica no mercado imobiliário?',
      resposta:
        'O primeiro passo é ter contas bancárias e controles separados para a PJ, faturando os serviços pela empresa e formalizando a retirada de pró-labore e lucros. A Immovi estrutura essa organização para você ter clareza financeira e segurança fiscal.',
    },
    {
      pergunta: 'Quando vale a pena trocar de contador?',
      resposta:
        'Quando você não recebe orientação clara, sente que paga mais imposto do que deveria, tem dificuldade de contato ou percebe que seu contador não entende o mercado imobiliário. Fazemos a transição de forma organizada, analisando pendências antes da migração.',
    },
    {
      pergunta: 'A Immovi atende empresas de outros estados?',
      resposta:
        'Sim. Nosso atendimento é digital, o que permite atender profissionais e empresas do mercado imobiliário em todo o Brasil, com a mesma proximidade e suporte.',
    },
    {
      pergunta: 'Como funciona a consultoria gratuita da Immovi?',
      resposta:
        'Você preenche o formulário com algumas informações sobre o seu negócio e nossa equipe entra em contato para entender sua situação e indicar o melhor caminho contábil. É uma conversa sem compromisso e 100% gratuita.',
    },
    {
      pergunta: 'A Immovi atende construtoras e incorporadoras?',
      resposta:
        'Sim. Atendemos construtoras e incorporadoras com soluções específicas, como gestão por obra, RET, SPE, organização de custos e obrigações fiscais do setor da construção e da incorporação imobiliária.',
    },
  ],
}

/* ----------------------------- FORMULÁRIO ---------------------------- */

export const FORM = {
  titulo: 'Consultoria Gratuita para o seu Negócio Imobiliário',
  subtitulo:
    'Preencha o formulário e nossa equipe entra em contato para entender sua situação e indicar o melhor caminho contábil para sua empresa.',
  beneficios: [
    'Análise da sua situação fiscal',
    'Orientação sobre enquadramento e organização',
    'Planejamento tributário dentro da lei',
    'Sem compromisso — 100% gratuito',
  ],
  sucesso:
    'Solicitação enviada! Nossa equipe vai analisar suas informações e entrar em contato pelo WhatsApp em breve.',
  erro:
    'Não foi possível enviar sua solicitação agora. Tente novamente em instantes ou fale com a gente pelo WhatsApp.',
  opcoes: {
    tipoAtuacao: [
      { value: 'corretor', label: 'Corretor de imóveis PJ' },
      { value: 'imobiliaria', label: 'Imobiliária' },
      { value: 'arquiteto', label: 'Arquiteto' },
      { value: 'designer_interiores', label: 'Designer de interiores' },
      { value: 'engenheiro_pj', label: 'Engenheiro PJ' },
      { value: 'advogado_imobiliario', label: 'Advogado imobiliário' },
      {
        value: 'correspondente_bancario',
        label: 'Correspondente bancário imobiliário',
      },
      { value: 'construtora', label: 'Construtora' },
      { value: 'incorporadora', label: 'Incorporadora' },
      { value: 'administradora_condominios', label: 'Administradora de condomínios' },
      { value: 'topografo', label: 'Topógrafo' },
      { value: 'vistoriador', label: 'Vistoriador / laudos imobiliários' },
      { value: 'despachante', label: 'Despachante imobiliário' },
      { value: 'outro', label: 'Outro' },
    ],
    situacaoAtual: [
      { value: 'abrir_empresa', label: 'Quero abrir uma empresa' },
      { value: 'ja_tenho_cnpj', label: 'Já tenho CNPJ' },
      { value: 'autonomo', label: 'Atuo como autônomo' },
      { value: 'trocar_contador', label: 'Quero trocar de contador' },
      { value: 'duvidas_fiscais', label: 'Estou com dúvidas fiscais' },
      { value: 'organizar_pj', label: 'Quero organizar minha PJ' },
      { value: 'reduzir_impostos', label: 'Quero reduzir impostos dentro da lei' },
    ],
    faturamentoMensal: [
      { value: 'ate_5k', label: 'Até R$ 5 mil' },
      { value: '5k_15k', label: 'De R$ 5 mil a R$ 15 mil' },
      { value: '15k_30k', label: 'De R$ 15 mil a R$ 30 mil' },
      { value: '30k_60k', label: 'De R$ 30 mil a R$ 60 mil' },
      { value: 'acima_60k', label: 'Acima de R$ 60 mil' },
      { value: 'nao_informar', label: 'Prefiro não informar' },
    ],
    emiteNota: [
      { value: 'sim', label: 'Sim' },
      { value: 'nao', label: 'Não' },
      { value: 'as_vezes', label: 'Às vezes' },
      { value: 'duvidas', label: 'Tenho dúvidas sobre isso' },
    ],
    principalNecessidade: [
      { value: 'abrir_empresa', label: 'Abrir empresa' },
      { value: 'trocar_contador', label: 'Trocar de contador' },
      { value: 'reduzir_impostos', label: 'Reduzir impostos' },
      { value: 'organizar_financeiro', label: 'Organizar financeiro' },
      { value: 'emitir_nota', label: 'Emitir notas fiscais' },
      { value: 'regularizar_empresa', label: 'Regularizar empresa' },
      { value: 'planejamento_tributario', label: 'Planejamento tributário' },
      { value: 'separar_pf_pj', label: 'Separar PF e PJ' },
      { value: 'outro', label: 'Outro' },
    ],
  },
}

/* ------------------------------ CTA FINAL ---------------------------- */

export const CTA_FINAL = {
  titulo: 'Sua empresa imobiliária merece uma contabilidade à altura',
  subtitulo:
    'Deixe a burocracia com a Immovi e foque no que importa: crescer com segurança, organização e clareza.',
  ctaPrimario: { label: 'Consultoria Gratuita', href: '#consultoria' },
  ctaSecundario: { label: 'Falar pelo WhatsApp', whatsappKey: 'geral' as WhatsAppKey },
}

/* ------------------------------- FOOTER ------------------------------ */

export const FOOTER = {
  tagline:
    'Mais do que uma contabilidade. Somos inteligência financeira, tecnologia e estratégia para quem vive do mercado imobiliário.',
  copyright: '© 2026 Immovi Contabilidade. Todos os direitos reservados.',
}
