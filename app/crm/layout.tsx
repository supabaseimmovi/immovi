import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/crm-session'
import CrmSidebar from '@/components/crm/CrmSidebar'

export const metadata: Metadata = {
  title: 'CRM Immovi',
  robots: { index: false, follow: false },
}

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-[#eef2f4]">
      <CrmSidebar email={session.email} nome={session.nome} />
      <div className="md:pl-64">
        <main className="px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  )
}
