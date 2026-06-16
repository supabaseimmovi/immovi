/**
 * Script opcional para criar um usuário admin inicial.
 *
 * Ele carrega variáveis de ambiente do processo ou de .env.local, mas nunca
 * deve conter chaves/senhas hardcoded. Rode migrations pelo Supabase CLI ou
 * SQL Editor antes de usar este script.
 */
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

function loadEnvLocal() {
  const envPath = join(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const match = line.match(/^\s*([^#=]+)=(.*)\s*$/)
    if (!match) continue

    const key = match[1].trim()
    const value = match[2].trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

function required(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Variável obrigatória ausente: ${name}`)
  return value
}

loadEnvLocal()

const SUPABASE_URL = required('NEXT_PUBLIC_SUPABASE_URL')
const SERVICE_ROLE_KEY = required('SUPABASE_SERVICE_ROLE_KEY')
const ADMIN_EMAIL = required('CRM_ADMIN_EMAIL')
const ADMIN_SENHA = required('CRM_ADMIN_SENHA')
const ADMIN_NOME = process.env.CRM_ADMIN_NOME?.trim() || 'Administrador Immovi'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

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
  console.log('=== Criação de Admin — Immovi ===')

  const ok = await testConnection()
  if (!ok) process.exit(1)

  await createAdminUser()

  // Verifica resultado final
  const { data: users, error } = await supabase
    .from('crm_users')
    .select('id, email, role, ativo')

  if (!error) {
    console.log('\n=== Usuários no CRM ===')
    console.table(users)
  }

  console.log(`\n✓ Setup concluído.`)
  console.log(`\nAcesse o CRM em: http://localhost:3000/login`)
  console.log(`E-mail: ${ADMIN_EMAIL}`)
  console.log('Senha:  definida via CRM_ADMIN_SENHA; não compartilhe por arquivo versionado.')
}

main().catch(console.error)
