import type { Metadata } from 'next'
import { Albert_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { EMPRESA } from '@/lib/constants'

const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-albert',
  display: 'swap',
})

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export const metadata: Metadata = {
  metadataBase: new URL(EMPRESA.dominio),
  title: {
    default: 'Immovi Contabilidade | Contabilidade para o Mercado Imobiliário',
    template: '%s | Immovi Contabilidade',
  },
  description:
    'Contabilidade especializada para corretores, imobiliárias, arquitetos, engenheiros, designers e profissionais do mercado imobiliário. Receba uma consultoria gratuita da Immovi.',
  keywords: [
    'contabilidade para mercado imobiliário',
    'contabilidade para corretor de imóveis',
    'contador para corretor de imóveis PJ',
    'contabilidade para imobiliária',
    'contabilidade para arquitetos',
    'contabilidade para engenheiros',
    'planejamento tributário imobiliário',
  ],
  authors: [{ name: EMPRESA.nome }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: EMPRESA.dominio,
    siteName: EMPRESA.nome,
    title: 'Immovi Contabilidade | Contabilidade para o Mercado Imobiliário',
    description:
      'Contabilidade especializada para corretores, imobiliárias, arquitetos, engenheiros, designers e profissionais do mercado imobiliário. Receba uma consultoria gratuita da Immovi.',
    images: [
      {
        url: '/og-image.jpg',
        secureUrl: '/og-image.jpg',
        type: 'image/jpeg',
        width: 1200,
        height: 630,
        alt: 'Immovi Contabilidade — Especialistas no Ecossistema Imobiliário',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Immovi Contabilidade | Contabilidade para o Mercado Imobiliário',
    description:
      'Contabilidade especializada para profissionais e empresas do mercado imobiliário. Consultoria gratuita.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={albertSans.variable}>
      <head>
        {/* Google Tag Manager */}
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}

        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body
        className="font-sans bg-brancoFrio text-azulEscuro antialiased"
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  )
}
