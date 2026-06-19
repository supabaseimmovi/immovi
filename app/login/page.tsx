import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/crm-session'
import { EMPRESA } from '@/lib/constants'
import LoginForm from '@/components/crm/LoginForm'

export const metadata: Metadata = {
  title: 'Acesso ao CRM',
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string }
}) {
  // Já autenticado → vai direto para o CRM
  const session = await getSession()
  if (session) redirect('/crm')

  const next =
    searchParams.next && searchParams.next.startsWith('/crm')
      ? searchParams.next
      : '/crm'

  return (
    <main className="flex min-h-screen items-center justify-center bg-azulEscuro px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/media/logo/logo-v2.png"
            alt={`${EMPRESA.nome} — ${EMPRESA.slogan}`}
            width={2432}
            height={613}
            priority
            className="h-12 w-auto"
          />
          <p className="mt-4 text-sm text-azulAcinzentado">
            Painel interno · CRM de leads
          </p>
        </div>
        <LoginForm next={next} />
      </div>
    </main>
  )
}
