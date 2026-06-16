/**
 * Teste de proteção Turnstile — simula ataques de bot direto na API.
 * Execute com: node scripts/test-turnstile.mjs
 *
 * O que testa:
 *   1. POST /api/leads sem token       → deve retornar 403
 *   2. POST /api/leads com token falso  → deve retornar 403
 *   3. POST /api/leads/widget sem token → deve retornar 403
 *   4. POST /api/leads/widget com token falso → deve retornar 403
 *
 * Se todos retornarem 403, a proteção está funcionando.
 * Um lead real (com token válido gerado pelo browser) passaria normalmente.
 */

const BASE_URL = 'https://immovi-sigma.vercel.app'

const COR = {
  verde: '\x1b[32m',
  vermelho: '\x1b[31m',
  amarelo: '\x1b[33m',
  cinza: '\x1b[90m',
  reset: '\x1b[0m',
  negrito: '\x1b[1m',
}

function log(tipo, msg) {
  const cor = tipo === 'ok' ? COR.verde : tipo === 'erro' ? COR.vermelho : COR.amarelo
  console.log(`${cor}${tipo === 'ok' ? '✅' : tipo === 'erro' ? '❌' : 'ℹ️ '}${COR.reset} ${msg}`)
}

async function testar({ descricao, url, payload, esperado }) {
  process.stdout.write(`${COR.cinza}  → ${descricao}...${COR.reset} `)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': BASE_URL,
        'Referer': `${BASE_URL}/`,
      },
      body: JSON.stringify(payload),
    })

    const json = await res.json().catch(() => ({}))
    const passou = res.status === esperado

    console.log(
      `${passou ? COR.verde + '✅ CORRETO' : COR.vermelho + '❌ FALHOU'}${COR.reset} ` +
      `[HTTP ${res.status}] ${json.error || json.ok || ''}`
    )

    return { passou, status: res.status, body: json }
  } catch (err) {
    console.log(`${COR.vermelho}❌ ERRO DE REDE${COR.reset} ${err.message}`)
    return { passou: false, status: 0, body: {} }
  }
}

async function main() {
  console.log(`\n${COR.negrito}=== Teste de Proteção Turnstile — Immovi Contabilidade ===${COR.reset}`)
  console.log(`${COR.cinza}Alvo: ${BASE_URL}${COR.reset}\n`)

  const LEAD_BASE = {
    nome: 'Bot Teste Automatizado',
    whatsapp: '(11) 91234-5678',
    tipo_atuacao: 'corretor',
    situacao_atual: 'ja_tem_cnpj',
    faturamento_mensal: 'ate_5k',
    principal_necessidade: 'trocar_contador',
  }

  const WIDGET_BASE = {
    nome: 'Bot Teste Automatizado',
    whatsapp: '(11) 91234-5678',
  }

  const casos = [
    {
      descricao: 'Formulário — sem token (bot sem browser)',
      url: `${BASE_URL}/api/leads`,
      payload: LEAD_BASE,
      esperado: 403,
    },
    {
      descricao: 'Formulário — token inválido (bot tentando burlar)',
      url: `${BASE_URL}/api/leads`,
      payload: { ...LEAD_BASE, cf_token: 'token-falso-abc123' },
      esperado: 403,
    },
    {
      descricao: 'Formulário — token vazio (string em branco)',
      url: `${BASE_URL}/api/leads`,
      payload: { ...LEAD_BASE, cf_token: '' },
      esperado: 403,
    },
    {
      descricao: 'Widget WhatsApp — sem token (bot sem browser)',
      url: `${BASE_URL}/api/leads/widget`,
      payload: WIDGET_BASE,
      esperado: 403,
    },
    {
      descricao: 'Widget WhatsApp — token inválido (bot tentando burlar)',
      url: `${BASE_URL}/api/leads/widget`,
      payload: { ...WIDGET_BASE, cf_token: 'token-falso-xyz999' },
      esperado: 403,
    },
    {
      descricao: 'Widget WhatsApp — token vazio (string em branco)',
      url: `${BASE_URL}/api/leads/widget`,
      payload: { ...WIDGET_BASE, cf_token: '' },
      esperado: 403,
    },
  ]

  const resultados = []
  for (const caso of casos) {
    const resultado = await testar(caso)
    resultados.push(resultado)
  }

  const bloqueados = resultados.filter((r) => r.passou).length
  const total = resultados.length

  console.log(`\n${COR.negrito}=== Resultado Final ===${COR.reset}`)
  console.log(`Bloqueados: ${bloqueados}/${total}`)

  if (bloqueados === total) {
    log('ok', `Proteção Turnstile funcionando corretamente! Bots não conseguem enviar leads.`)
    log('ok', `Verifique os logs da Vercel em Functions → /api/leads para ver os registros de bloqueio.`)
  } else {
    log('erro', `${total - bloqueados} caso(s) não foram bloqueados. Verifique as variáveis de ambiente na Vercel.`)
  }

  console.log(
    `\n${COR.cinza}Nota: um lead real enviado pelo browser com Turnstile válido passaria normalmente.` +
    `\nEste script prova que chamadas diretas à API (sem browser) são bloqueadas.${COR.reset}\n`
  )
}

main().catch(console.error)
