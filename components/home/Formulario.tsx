'use client'

import { useState, useEffect, useRef, type FormEvent } from 'react'
import { CheckCircle2, Loader2, ShieldCheck, AlertCircle } from 'lucide-react'
import { FORM } from '@/lib/content'
import { whatsappLink, MENSAGENS_WHATSAPP } from '@/lib/constants'
import { analytics } from '@/lib/analytics'

interface FormState {
  nome: string
  whatsapp: string
  email: string
  tipo_atuacao: string
  tipo_atuacao_outro: string
  situacao_atual: string
  faturamento_mensal: string
  emite_nota: string
  quantidade_notas: string
  principal_necessidade: string
  mensagem: string
}

const ESTADO_INICIAL: FormState = {
  nome: '',
  whatsapp: '',
  email: '',
  tipo_atuacao: '',
  tipo_atuacao_outro: '',
  situacao_atual: '',
  faturamento_mensal: '',
  emite_nota: '',
  quantidade_notas: '',
  principal_necessidade: '',
  mensagem: '',
}

function mascararWhatsapp(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const inputClasses =
  'w-full rounded-lg border border-cinzaClaro bg-white px-4 py-3 text-sm text-azulEscuro outline-none transition-colors placeholder:text-azulAcinzentado focus:border-verde focus:ring-2 focus:ring-verde/30'
const labelClasses = 'mb-1.5 block text-sm font-medium text-azulEscuro'

export default function Formulario() {
  const [form, setForm] = useState<FormState>(ESTADO_INICIAL)
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [erros, setErros] = useState<Partial<Record<keyof FormState, string>>>({})
  const [cfToken, setCfToken] = useState('')
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)

  useEffect(() => {
    if (!document.getElementById('cf-turnstile-script')) {
      const s = document.createElement('script')
      s.id = 'cf-turnstile-script'
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      s.async = true
      document.head.appendChild(s)
    }
    const iv = setInterval(() => {
      if (window.turnstile && turnstileRef.current && !widgetId.current) {
        clearInterval(iv)
        widgetId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          callback: (t) => setCfToken(t),
          'expired-callback': () => setCfToken(''),
          'error-callback': () => setCfToken(''),
          size: 'invisible',
          theme: 'light',
        })
      }
    }, 100)
    return () => clearInterval(iv)
  }, [])

  const set = (campo: keyof FormState, valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined }))
  }

  function validar(): boolean {
    const novos: Partial<Record<keyof FormState, string>> = {}
    if (!form.nome.trim()) novos.nome = 'Informe seu nome.'
    const digitos = form.whatsapp.replace(/\D/g, '')
    if (digitos.length < 10) novos.whatsapp = 'Informe um WhatsApp válido.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      novos.email = 'E-mail inválido.'
    if (!form.tipo_atuacao) novos.tipo_atuacao = 'Selecione uma opção.'
    if (form.tipo_atuacao === 'outro' && !form.tipo_atuacao_outro.trim())
      novos.tipo_atuacao_outro = 'Descreva seu tipo de atuação.'
    if (!form.situacao_atual) novos.situacao_atual = 'Selecione uma opção.'
    if (!form.faturamento_mensal)
      novos.faturamento_mensal = 'Selecione uma opção.'
    if (!form.principal_necessidade)
      novos.principal_necessidade = 'Selecione uma opção.'
    setErros(novos)
    return Object.keys(novos).length === 0
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (loading || enviado) return
    setErro(null)
    if (!validar()) return

    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, cf_token: cfToken }),
      })
      if (!res.ok) throw new Error('Falha no envio')
      analytics.formSubmitConsultoria({
        tipo_atuacao: form.tipo_atuacao,
        principal_necessidade: form.principal_necessidade,
      })
      setEnviado(true)
      setForm(ESTADO_INICIAL)
      if (widgetId.current && window.turnstile) {
        window.turnstile.reset(widgetId.current)
        setCfToken('')
      }
    } catch {
      setErro(FORM.erro)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="consultoria" className="bg-azulEscuro py-20 text-brancoFrio md:py-24">
      <div className="container grid gap-12 lg:grid-cols-2 lg:items-start">
        {/* Coluna informativa */}
        <div className="lg:sticky lg:top-28">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            {FORM.titulo}
          </h2>
          <p className="mt-4 text-base text-brancoFrio/80 md:text-lg">
            {FORM.subtitulo}
          </p>
          <ul className="mt-8 space-y-4">
            {FORM.beneficios.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-verde/15 text-verde">
                  <CheckCircle2 size={18} />
                </span>
                <span className="text-sm text-brancoFrio/85 md:text-base">{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-brancoFrio/70">
            <ShieldCheck size={18} className="text-verde" />
            Seus dados são tratados com segurança e sigilo.
          </p>
        </div>

        {/* Formulário */}
        <div className="rounded-2xl bg-brancoFrio p-6 shadow-2xl shadow-black/30 md:p-8">
          {enviado ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-verde/15 text-verde">
                <CheckCircle2 size={36} />
              </span>
              <h3 className="mt-5 text-xl font-bold text-azulEscuro">
                Solicitação enviada!
              </h3>
              <p className="mt-3 max-w-sm text-sm text-cinzaMedio">{FORM.sucesso}</p>
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="mt-6 text-sm font-semibold text-verde hover:underline"
              >
                Enviar outra solicitação
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="nome" className={labelClasses}>
                  Nome <span className="text-verde">*</span>
                </label>
                <input
                  id="nome"
                  type="text"
                  value={form.nome}
                  onChange={(e) => set('nome', e.target.value)}
                  className={inputClasses}
                  placeholder="Seu nome completo"
                  autoComplete="name"
                />
                {erros.nome && <ErroCampo msg={erros.nome} />}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="whatsapp" className={labelClasses}>
                    WhatsApp <span className="text-verde">*</span>
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    inputMode="numeric"
                    value={form.whatsapp}
                    onChange={(e) => set('whatsapp', mascararWhatsapp(e.target.value))}
                    className={inputClasses}
                    placeholder="(11) 99999-9999"
                    autoComplete="tel"
                  />
                  {erros.whatsapp && <ErroCampo msg={erros.whatsapp} />}
                </div>
                <div>
                  <label htmlFor="email" className={labelClasses}>
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={inputClasses}
                    placeholder="voce@email.com"
                    autoComplete="email"
                  />
                  {erros.email && <ErroCampo msg={erros.email} />}
                </div>
              </div>

              <div>
                <label htmlFor="tipo_atuacao" className={labelClasses}>
                  Tipo de atuação <span className="text-verde">*</span>
                </label>
                <select
                  id="tipo_atuacao"
                  value={form.tipo_atuacao}
                  onChange={(e) => set('tipo_atuacao', e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Selecione...</option>
                  {FORM.opcoes.tipoAtuacao.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {erros.tipo_atuacao && <ErroCampo msg={erros.tipo_atuacao} />}
              </div>

              {form.tipo_atuacao === 'outro' && (
                <div>
                  <label htmlFor="tipo_atuacao_outro" className={labelClasses}>
                    Qual tipo de atuação? <span className="text-verde">*</span>
                  </label>
                  <input
                    id="tipo_atuacao_outro"
                    type="text"
                    value={form.tipo_atuacao_outro}
                    onChange={(e) => set('tipo_atuacao_outro', e.target.value)}
                    className={inputClasses}
                    placeholder="Descreva sua atuação"
                  />
                  {erros.tipo_atuacao_outro && (
                    <ErroCampo msg={erros.tipo_atuacao_outro} />
                  )}
                </div>
              )}

              <div>
                <label htmlFor="situacao_atual" className={labelClasses}>
                  Situação atual <span className="text-verde">*</span>
                </label>
                <select
                  id="situacao_atual"
                  value={form.situacao_atual}
                  onChange={(e) => set('situacao_atual', e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Selecione...</option>
                  {FORM.opcoes.situacaoAtual.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {erros.situacao_atual && <ErroCampo msg={erros.situacao_atual} />}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="faturamento_mensal" className={labelClasses}>
                    Faturamento mensal <span className="text-verde">*</span>
                  </label>
                  <select
                    id="faturamento_mensal"
                    value={form.faturamento_mensal}
                    onChange={(e) => set('faturamento_mensal', e.target.value)}
                    className={inputClasses}
                  >
                    <option value="">Selecione...</option>
                    {FORM.opcoes.faturamentoMensal.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {erros.faturamento_mensal && (
                    <ErroCampo msg={erros.faturamento_mensal} />
                  )}
                </div>
                <div>
                  <label htmlFor="emite_nota" className={labelClasses}>
                    Emite nota fiscal?
                  </label>
                  <select
                    id="emite_nota"
                    value={form.emite_nota}
                    onChange={(e) => {
                      set('emite_nota', e.target.value)
                      if (e.target.value !== 'sim') set('quantidade_notas', '')
                    }}
                    className={inputClasses}
                  >
                    <option value="">Selecione...</option>
                    {FORM.opcoes.emiteNota.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {form.emite_nota === 'sim' && (
                <div>
                  <label htmlFor="quantidade_notas" className={labelClasses}>
                    Quantas notas fiscais você emite por mês?
                  </label>
                  <input
                    id="quantidade_notas"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="9999"
                    value={form.quantidade_notas}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '')
                      set('quantidade_notas', v)
                    }}
                    className={inputClasses}
                    placeholder="Ex: 10"
                  />
                </div>
              )}

              <div>
                <label htmlFor="principal_necessidade" className={labelClasses}>
                  Principal necessidade <span className="text-verde">*</span>
                </label>
                <select
                  id="principal_necessidade"
                  value={form.principal_necessidade}
                  onChange={(e) => set('principal_necessidade', e.target.value)}
                  className={inputClasses}
                >
                  <option value="">Selecione...</option>
                  {FORM.opcoes.principalNecessidade.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {erros.principal_necessidade && (
                  <ErroCampo msg={erros.principal_necessidade} />
                )}
              </div>

              <div>
                <label htmlFor="mensagem" className={labelClasses}>
                  Mensagem adicional
                </label>
                <textarea
                  id="mensagem"
                  value={form.mensagem}
                  onChange={(e) => set('mensagem', e.target.value)}
                  rows={3}
                  className={`${inputClasses} resize-none`}
                  placeholder="Conte um pouco mais sobre sua necessidade (opcional)"
                />
              </div>

              <div ref={turnstileRef} className="hidden" />

              {erro && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>
                    {erro}{' '}
                    <a
                      href={whatsappLink(MENSAGENS_WHATSAPP.consultoria)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline"
                    >
                      Falar no WhatsApp
                    </a>
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-verde px-6 py-3.5 text-base font-semibold text-azulEscuro transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Solicitar Consultoria Gratuita'
                )}
              </button>
              <p className="text-center text-xs text-azulAcinzentado">
                Ao enviar, você concorda em ser contatado pela equipe da Immovi.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function ErroCampo({ msg }: { msg: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
      <AlertCircle size={13} />
      {msg}
    </p>
  )
}
