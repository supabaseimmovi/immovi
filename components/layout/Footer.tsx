'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, MapPin } from 'lucide-react'
import InstagramIcon from '@/components/icons/InstagramIcon'
import { EMPRESA, whatsappLink, MENSAGENS_WHATSAPP } from '@/lib/constants'
import { NAV_ITEMS, SERVICOS, SEGMENTOS, FOOTER } from '@/lib/content'
import { analytics } from '@/lib/analytics'

export default function Footer() {
  return (
    <footer className="bg-azulEscuro text-brancoFrio">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="lg:col-span-1">
            <Link href="/#inicio" className="inline-flex items-center">
              <Image
                src="/media/logo/logo-v2.png"
                alt={`${EMPRESA.nome} — ${EMPRESA.slogan}`}
                width={2432}
                height={613}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brancoFrio/70">
              {FOOTER.tagline}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={EMPRESA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Immovi Contabilidade"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-verde hover:text-azulEscuro"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href={whatsappLink(MENSAGENS_WHATSAPP.geral)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.whatsappClick('footer')}
                aria-label="WhatsApp da Immovi Contabilidade"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-verde hover:text-azulEscuro"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-verde">
              Navegação
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-brancoFrio/75 transition-colors hover:text-verde"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-verde">
              Serviços
            </h3>
            <ul className="mt-4 space-y-2.5">
              {SERVICOS.itens.map((s) => (
                <li key={s.titulo}>
                  <Link
                    href="/#servicos"
                    className="text-sm text-brancoFrio/75 transition-colors hover:text-verde"
                  >
                    {s.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Segmentos + Endereço */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-verde">
              Para quem é
            </h3>
            <ul className="mt-4 space-y-2.5">
              {SEGMENTOS.itens.slice(0, 6).map((seg) => (
                <li key={seg.href}>
                  <Link
                    href={seg.href}
                    className="text-sm text-brancoFrio/75 transition-colors hover:text-verde"
                  >
                    {seg.nome}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-2 text-sm text-brancoFrio/75">
              <MapPin size={18} className="mt-0.5 shrink-0 text-verde" />
              <address className="not-italic">
                {EMPRESA.endereco.cidade}
                <br />
                {EMPRESA.endereco.logradouro}
              </address>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-brancoFrio/60 md:flex-row md:items-center md:justify-between">
          <p>{FOOTER.copyright}</p>
          <div className="flex items-center gap-6">
            <Link href="/politica-de-privacidade" className="hover:text-verde">
              Política de privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
