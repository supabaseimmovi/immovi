import Image from 'next/image'
import { Sparkles, ShieldCheck, TrendingDown } from 'lucide-react'
import { HERO } from '@/lib/content'
import EventLink from '@/components/ui/EventLink'
import WhatsAppCTA from '@/components/ui/WhatsAppCTA'

const destaques = [
  { icon: ShieldCheck, label: 'Menos riscos fiscais' },
  { icon: TrendingDown, label: 'Impostos dentro da lei' },
  { icon: Sparkles, label: 'Atendimento digital' },
]

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-azulEscuro text-brancoFrio md:min-h-[calc(100svh-5rem)]"
    >
      {/* Imagem de fundo */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/media/hero/hero-poster.jpg"
          alt="Profissionais do mercado imobiliário com contabilidade digital especializada"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-azulEscuro/95 via-azulEscuro/85 to-azulEscuro/65" />
      </div>

      {/* Glow decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-verde/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-azulAcinzentado/20 blur-3xl"
      />

      <div className="container relative z-10 grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-verde/40 bg-verde/10 px-4 py-1.5 text-sm font-medium text-verde">
            <Sparkles size={16} />
            Especialistas no Ecossistema Imobiliário
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            {HERO.h1}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brancoFrio/80 md:text-lg">
            {HERO.subheadline}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <EventLink
              href={HERO.ctaPrimario.href}
              event="cta_hero_click"
              className="rounded-full bg-verde px-7 py-3.5 text-center text-base font-semibold text-azulEscuro transition-transform hover:scale-[1.03]"
            >
              {HERO.ctaPrimario.label}
            </EventLink>
            <WhatsAppCTA
              messageKey={HERO.ctaSecundario.whatsappKey}
              origem="hero"
              className="rounded-full border border-white/25 px-7 py-3.5 text-center text-base font-semibold text-brancoFrio transition-colors hover:border-verde hover:text-verde"
            >
              {HERO.ctaSecundario.label}
            </WhatsAppCTA>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {destaques.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm text-brancoFrio/75"
              >
                <Icon size={18} className="text-verde" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Card lateral */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/30 backdrop-blur md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-verde">
              Consultoria gratuita
            </p>
            <p className="mt-3 text-xl font-bold leading-snug md:text-2xl">
              Descubra o melhor caminho contábil para o seu negócio imobiliário.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-brancoFrio/80">
              {[
                'Análise da sua situação fiscal',
                'Orientação sobre enquadramento',
                'Planejamento tributário dentro da lei',
                'Sem compromisso — 100% gratuito',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-verde" />
                  {item}
                </li>
              ))}
            </ul>
            <EventLink
              href="#consultoria"
              event="cta_hero_click"
              eventParams={{ origem: 'hero_card' }}
              className="mt-7 block rounded-full bg-verde px-6 py-3 text-center text-base font-semibold text-azulEscuro transition-transform hover:scale-[1.02]"
            >
              Quero minha consultoria
            </EventLink>
          </div>
        </div>
      </div>
    </section>
  )
}
