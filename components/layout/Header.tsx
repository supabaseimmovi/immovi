'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/content'
import { EMPRESA } from '@/lib/constants'
import { analytics } from '@/lib/analytics'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll animado via rAF — ignora prefers-reduced-motion do sistema operacional
  function animateScroll(targetY: number, duration = 650) {
    const startY = window.scrollY
    const distance = targetY - startY
    let startTime: number | null = null

    function step(now: number) {
      if (!startTime) startTime = now
      const t = Math.min((now - startTime) / duration, 1)
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      window.scrollTo(0, startY + distance * ease)
      if (t < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  // Se o elemento alvo existe na página atual → scroll suave.
  // Se não existe (usuário está em outra página) → navega para /#secao.
  function navClick(href: string, onAfter?: () => void) {
    onAfter?.()
    const id = href.replace('/#', '')
    const el = document.getElementById(id)

    if (el) {
      const elTop    = el.getBoundingClientRect().top + window.scrollY
      const elHeight = el.offsetHeight
      const vpHeight = window.innerHeight
      const maxScroll = document.documentElement.scrollHeight - vpHeight

      const target = elHeight <= vpHeight - 80
        ? elTop - (vpHeight - elHeight) / 2
        : elTop - 80

      animateScroll(Math.max(0, Math.min(target, maxScroll)))
    } else {
      router.push(href)
    }
  }

  // Trava o scroll do body quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])


  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-azulEscuro text-brancoFrio transition-shadow ${
        scrolled ? 'shadow-lg shadow-azulEscuro/30' : ''
      }`}
    >
      <div className="container flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link
          href="/#inicio"
          className="flex items-center"
          aria-label={`${EMPRESA.nome} — início`}
        >
          <Image
            src="/media/logo/logo-v2.png"
            alt={`${EMPRESA.nome} — ${EMPRESA.slogan}`}
            width={2432}
            height={613}
            priority
            className="h-8 w-auto md:h-10"
          />
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.filter((i) => i.label !== 'Consultoria gratuita').map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => navClick(item.href)}
              className="text-sm font-medium text-brancoFrio/85 transition-colors hover:text-verde"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden lg:block">
          <button
            type="button"
            onClick={() => { analytics.ctaHeaderClick(); navClick('/#consultoria') }}
            className="rounded-full bg-verde px-5 py-2.5 text-sm font-semibold text-azulEscuro transition-transform hover:scale-[1.03] hover:brightness-105"
          >
            Consultoria Gratuita
          </button>
        </div>

        {/* Botão menu mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-brancoFrio lg:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="border-t border-white/10 bg-azulEscuro lg:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navClick(item.href, () => setOpen(false))}
                className="rounded-md px-2 py-3 text-left text-base font-medium text-brancoFrio/90 transition-colors hover:bg-white/5 hover:text-verde"
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { analytics.ctaHeaderClick(); navClick('/#consultoria', () => setOpen(false)) }}
              className="mt-2 rounded-full bg-verde px-5 py-3 text-center text-base font-semibold text-azulEscuro"
            >
              Consultoria Gratuita
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
