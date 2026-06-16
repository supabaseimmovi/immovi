/**
 * Script de setup do banco — roda uma vez para criar tabelas e usuário admin.
 * Execute com: node scripts/setup-db.mjs
 */
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = 'https://ktqokpwzlzacqjpdyrvn.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cW9rcHd6bHphY3FqcGR5cnZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTU3NTE3NiwiZXhwIjoyMDk3MTUxMTc2fQ.Q9n0GrBHS3HaE93Vwm_BDOiGxcJEdx8eE3Q1zK17AEU'

const ADMIN_EMAIL = 'admin@immovicontabilidade.com.br'
const ADMIN_SENHA = 'immovi@2026'
const ADMIN_NOME  = 'Administrador Immovi'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function runMigration(file) {
  const sql = readFileSync(join(__dir, '..', 'supabase', 'migrations', file), 'utf8')
  console.log(`\n▶ Executando ${file}...`)

  // Divide em statements individuais e executa via REST RPC
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  for (const stmt of statements) {
    const { error } = await supabase.rpc('exec_sql', { query: stmt + ';' }).catch(() => ({ error: { message: 'rpc não disponível' } }))
    if (error) {
      // Fallback: tenta via REST direto
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ query: stmt + ';' }),
      })
      if (!res.ok) {
        const text = await res.text()
        // Ignora erros de "já existe" (idempotência)
        if (!text.includes('already exists') && !text.includes('duplicate') && !text.includes('does not exist')) {
          console.warn(`  ⚠ ${stmt.slice(0, 60)}... → ${text.slice(0, 120)}`)
        }
      }
    }
  }
  console.log(`  ✓ ${file} processado`)
}

async function createAdminUser() {
  console.log('\n▶ Criando usuário admin...')

  // Verifica se já existe
  const { data: existing } = await supabase
    .from('crm_users')
    .select('id, email')
    .eq('email', ADMIN_EMAIL)
    .maybeSingle()

  if (existing) {
    console.log(`  ℹ Usuário ${ADMIN_EMAIL} já existe (id: ${existing.id})`)
    return
  }

  const senha_hash = await bcrypt.hash(ADMIN_SENHA, 12)

  const { data, error } = await supabase
    .from('crm_users')
    .insert({
      nome: ADMIN_NOME,
      email: ADMIN_EMAIL,
      senha_hash,
      role: 'admin',
      ativo: true,
    })
    .select('id')
    .single()

  if (error) {
    console.error(`  ✗ Erro ao criar usuário: ${error.message}`)
    return
  }

  console.log(`  ✓ Admin criado com sucesso (id: ${data.id})`)
}

async function testConnection() {
  console.log('\n▶ Testando conexão com Supabase...')
  const { error } = await supabase.from('crm_users').select('id').limit(1)
  if (error && !error.message.includes('does not exist')) {
    console.error(`  ✗ Erro de conexão: ${error.message}`)
    return false
  }
  console.log('  ✓ Conexão OK')
  return true
}

async function main() {
  console.log('=== Setup do Banco de Dados — Immovi ===')

  const ok = await testConnection()
  if (!ok) {
    console.log('\n  Tabelas ainda não existem — isso é esperado na primeira execução.')
  }

  await runMigration('001_initial.sql')
  await runMigration('002_security_hardening.sql')
  await createAdminUser()

  // Verifica resultado final
  const { data: users, error } = await supabase
    .from('crm_users')
    .select('id, email, role, ativo')

  if (!error) {
    console.log('\n=== Usuários no CRM ===')
    console.table(users)
  }

  const { data: leads } = await supabase
    .from('leads_immovi')
    .select('id', { count: 'exact', head: true })

  console.log(`\n✓ Setup concluído! Tabela leads_immovi pronta.`)
  console.log(`\nAcesse o CRM em: http://localhost:3000/login`)
  console.log(`E-mail: ${ADMIN_EMAIL}`)
  console.log(`Senha:  ${ADMIN_SENHA}`)
}

main().catch(console.error)
