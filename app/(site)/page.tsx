import type { Metadata } from 'next'
import { EMPRESA } from '@/lib/constants'
import Hero from '@/components/home/Hero'
import Dores from '@/components/home/Dores'
import Diferenciais from '@/components/home/Diferenciais'
import Segmentos from '@/components/home/Segmentos'
import Servicos from '@/components/home/Servicos'
import Jornada from '@/components/home/Jornada'
import Tecnologia from '@/components/home/Tecnologia'
import Planos from '@/components/home/Planos'
import FAQ from '@/components/home/FAQ'
import Formulario from '@/components/home/Formulario'
import CTAFinal from '@/components/home/CTAFinal'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Contabilidade para o Mercado Imobiliário',
  description:
    'Contabilidade digital para corretores, imobiliárias, arquitetos, engenheiros e profissionais do mercado imobiliário. Consultoria gratuita da Immovi.',
  alternates: { canonical: '/' },
}

const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'AccountingService', 'LocalBusiness'],
  name: EMPRESA.nome,
  description: 'Contabilidade especializada no ecossistema imobiliário',
  url: EMPRESA.dominio,
  telephone: EMPRESA.whatsapp,
  priceRange: EMPRESA.priceRange,
  areaServed: 'Brasil',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sorocaba',
    addressRegion: 'SP',
    addressCountry: 'BR',
    streetAddress: 'Rua Fernando Silva, 190 – Sala 802, Jardim Astro',
  },
  sameAs: [EMPRESA.instagram],
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: EMPRESA.nome,
  url: EMPRESA.dominio,
  slogan: EMPRESA.slogan,
  sameAs: [EMPRESA.instagram],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: EMPRESA.nome,
  url: EMPRESA.dominio,
  inLanguage: 'pt-BR',
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero />
      <Dores />
      <Diferenciais />
      <Segmentos />
      <Servicos />
      <Jornada />
      <Tecnologia />
      <Planos />
      <FAQ />
      <Formulario />
      <section id="contato">
        <CTAFinal />
        <Footer />
      </section>
    </>
  )
}
