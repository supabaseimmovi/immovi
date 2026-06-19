'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, LogOut } from 'lucide-react'
import { useState } from 'react'

const LINKS = [
  { href: '/crm', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/crm/leads', label: 'Leads', icon: Users, exact: false },
]

export default function CrmTopbar({
  email,
  nome,
}: {
  email: string
  nome?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [saindo, setSaindo] = useState(false)

  async function logout() {
    setSaindo(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-cinzaClaro bg-azulEscuro text-brancoFrio">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/crm" className="flex items-center gap-2">
            <Image
              src="/media/logo/logo-v2.png"
              alt="Immovi Contabilidade"
              width={2432}
              height={613}
              className="h-7 w-auto"
            />
            <span className="rounded bg-verde/15 px-2 py-0.5 text-xs font-bold text-verde">
              CRM
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {LINKS.map(({ href, label, icon: Icon, exact }) => {
              const ativo = exact ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    ativo
                      ? 'bg-verde/15 text-verde'
                      : 'text-brancoFrio/75 hover:bg-white/5 hover:text-brancoFrio'
                  }`}
                >
                  <Icon size={17} />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-brancoFrio/70 sm:inline">
            {nome || email}
          </span>
          <button
            type="button"
            onClick={logout}
            disabled={saindo}
            className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-brancoFrio/85 transition-colors hover:border-verde hover:text-verde disabled:opacity-60"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
