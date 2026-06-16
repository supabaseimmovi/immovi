'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle, Loader2, Send, X } from 'lucide-react'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import { whatsappLink } from '@/lib/constants'
import { analytics } from '@/lib/analytics'

type Estado = 'fechado' | 'aberto' | 'enviando' | 'sucesso'
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

function mascaraWhatsApp(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export default function WhatsAppButton() {
  const [visivel, setVisivel] = useState(false)
  const [estado, setEstado] = useState<Estado>('fechado')
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [duvida, setDuvida] = useState('')
  const [erro, setErro] = useState('')
  const [urlFinal, setUrlFinal] = useState('')
  const [cfToken, setCfToken] = useState('')
  const nomeRef = useRef<HTMLInputElement>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const tokenResolver = useRef<((token: string) => void) | null>(null)

  useEffect(() => {
    const onScroll = () => setVisivel(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return

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
          sitekey: TURNSTILE_SITE_KEY,
          callback: (t) => {
            setCfToken(t)
            tokenResolver.current?.(t)
            tokenResolver.current = null
          },
          'expired-callback': () => {
            setCfToken('')
            tokenResolver.current?.('')
            tokenResolver.current = null
          },
          'error-callback': () => {
            setCfToken('')
            tokenResolver.current?.('')
            tokenResolver.current = null
          },
          size: 'invisible',
          theme: 'light',
        })
      }
    }, 100)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && estado !== 'fechado') fechar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    if (estado === 'aberto') {
      const t = setTimeout(() => nomeRef.current?.focus(), 80)
      return () => clearTimeout(t)
    }
  }, [estado])

  function abrir() {
    setEstado('aberto')
    analytics.whatsappClick('botao_flutuante_widget')
  }

  function fechar() {
    setEstado('fechado')
    setTimeout(() => {
      setNome('')
      setWhatsapp('')
      setDuvida('')
      setErro('')
    }, 300)
  }

  async function obterTokenTurnstile(): Promise<string> {
    if (!TURNSTILE_SITE_KEY) return ''
    if (cfToken) return cfToken
    if (!widgetId.current || !window.turnstile) return ''

    return new Promise((resolve) => {
      const timer = window.setTimeout(() => {
        tokenResolver.current = null
        resolve('')
      }, 5000)

      tokenResolver.current = (token) => {
        window.clearTimeout(timer)
        resolve(token)
      }

      window.turnstile?.execute(widgetId.current!)
    })
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (!nome.trim()) {
      setErro('Por favor, informe seu nome.')
      return
    }
    if (whatsapp.replace(/\D/g, '').length < 10) {
      setErro('WhatsApp inválido. Ex: (11) 91234-5678')
      return
    }

    setEstado('enviando')

    try {
      const token = await obterTokenTurnstile()
      const res = await fetch('/api/leads/widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          whatsapp,
          mensagem: duvida.trim() || undefined,
          cf_token: token,
        }),
      })
      const json = await res.json()

      if (!res.ok || !json.ok) {
        setErro(json.error || 'Erro ao enviar. Tente novamente.')
        setEstado('aberto')
        return
      }

      const msg = `Olá! Sou ${nome.trim()} e gostaria de falar com um especialista da Immovi Contabilidade.${duvida.trim() ? ` Minha dúvida: ${duvida.trim()}` : ''}`
      setUrlFinal(whatsappLink(msg))
      setEstado('sucesso')
      if (widgetId.current && window.turnstile) {
        window.turnstile.reset(widgetId.current)
        setCfToken('')
        tokenResolver.current = null
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
      setEstado('aberto')
    }
  }

  const isAberto = estado !== 'fechado'

  return (
    <>
      {/* Backdrop — fecha ao clicar fora */}
      {isAberto && (
        <div className="fixed inset-0 z-40" onClick={fechar} aria-hidden="true" />
      )}

      <div
        className={`fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 transition-all duration-300 ${
          visivel
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        {/* Popup */}
        {isAberto && (
          <div
            role="dialog"
            aria-label="Falar com a Immovi pelo WhatsApp"
            className="w-80 overflow-hidden rounded-2xl border border-cinzaClaro bg-white shadow-2xl shadow-azulEscuro/20 animate-fade-in-up"
          >
            {/* Cabeçalho */}
            <div className="flex items-start justify-between bg-azulEscuro px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-verde">
                  Immovi Contabilidade
                </p>
                <p className="mt-0.5 text-sm font-medium text-brancoFrio/90">
                  Como podemos ajudar?
                </p>
              </div>
              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar"
                className="ml-3 mt-0.5 rounded p-1 text-brancoFrio/60 transition-colors hover:bg-white/10 hover:text-brancoFrio"
              >
                <X size={16} />
              </button>
            </div>

            {/* Corpo */}
            <div className="px-5 py-4">
              <div ref={turnstileRef} className="hidden" />
              {estado === 'sucesso' ? (
                <div className="py-2 text-center">
                  <CheckCircle size={42} className="mx-auto text-verde" />
                  <p className="mt-3 text-base font-semibold text-azulEscuro">
                    Mensagem recebida!
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-cinzaMedio">
                    Nossa equipe foi notificada. Continue a conversa pelo WhatsApp.
                  </p>
                  <a
                    href={urlFinal}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analytics.whatsappClick('widget_sucesso')}
                    className="mt-5 flex items-center justify-center gap-2 rounded-full bg-verde px-5 py-3 text-sm font-semibold text-azulEscuro transition-transform hover:scale-[1.03]"
                  >
                    <WhatsAppIcon size={18} />
                    Abrir WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={enviar} noValidate>
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="ww-nome"
                        className="mb-1 block text-xs font-medium text-cinzaMedio"
                      >
                        Nome completo <span className="text-verde">*</span>
                      </label>
                      <input
                        ref={nomeRef}
                        id="ww-nome"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Seu nome"
                        maxLength={120}
                        disabled={estado === 'enviando'}
                        className="w-full rounded-lg border border-cinzaClaro bg-brancoFrio px-3 py-2.5 text-sm text-azulEscuro placeholder-cinzaMedio/50 outline-none transition-colors focus:border-verde focus:ring-1 focus:ring-verde disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="ww-whatsapp"
                        className="mb-1 block text-xs font-medium text-cinzaMedio"
                      >
                        WhatsApp <span className="text-verde">*</span>
                      </label>
                      <input
                        id="ww-whatsapp"
                        type="tel"
                        inputMode="numeric"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(mascaraWhatsApp(e.target.value))}
                        placeholder="(11) 91234-5678"
                        disabled={estado === 'enviando'}
                        className="w-full rounded-lg border border-cinzaClaro bg-brancoFrio px-3 py-2.5 text-sm text-azulEscuro placeholder-cinzaMedio/50 outline-none transition-colors focus:border-verde focus:ring-1 focus:ring-verde disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="ww-duvida"
                        className="mb-1 block text-xs font-medium text-cinzaMedio"
                      >
                        Sua dúvida{' '}
                        <span className="font-normal text-azulAcinzentado">(opcional)</span>
                      </label>
                      <textarea
                        id="ww-duvida"
                        value={duvida}
                        onChange={(e) => setDuvida(e.target.value)}
                        placeholder="Como podemos ajudar?"
                        rows={3}
                        maxLength={500}
                        disabled={estado === 'enviando'}
                        className="w-full resize-none rounded-lg border border-cinzaClaro bg-brancoFrio px-3 py-2.5 text-sm text-azulEscuro placeholder-cinzaMedio/50 outline-none transition-colors focus:border-verde focus:ring-1 focus:ring-verde disabled:opacity-60"
                      />
                    </div>

                    {erro && (
                      <p className="text-xs font-medium text-red-500">{erro}</p>
                    )}

                    <button
                      type="submit"
                      disabled={estado === 'enviando'}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-verde px-5 py-3 text-sm font-semibold text-azulEscuro transition-all hover:scale-[1.02] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {estado === 'enviando' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Enviando…
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Enviar e abrir WhatsApp
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Botão flutuante */}
        <button
          type="button"
          onClick={isAberto ? fechar : abrir}
          aria-label={isAberto ? 'Fechar' : 'Falar pelo WhatsApp'}
          title={isAberto ? 'Fechar' : 'Falar pelo WhatsApp'}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-verde text-azulEscuro shadow-xl shadow-azulEscuro/30 transition-all duration-300 hover:scale-105"
        >
          {isAberto ? <X size={26} /> : <WhatsAppIcon size={28} />}
          {!isAberto && (
            <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-md bg-azulEscuro px-3 py-1.5 text-sm font-medium text-brancoFrio shadow-lg group-hover:md:block">
              Falar pelo WhatsApp
            </span>
          )}
        </button>
      </div>
    </>
  )
}
