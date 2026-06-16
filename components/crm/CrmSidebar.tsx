'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const LINKS = [
  { href: '/crm', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/crm/leads', label: 'Leads', icon: Users, exact: false },
]

function SidebarConteudo({
  email,
  nome,
  onNavigate,
  saindo,
  onLogout,
  pathname,
}: {
  email: string
  nome?: string
  onNavigate?: () => void
  saindo: boolean
  onLogout: () => void
  pathname: string
}) {
  return (
    <div className="flex h-full flex-col bg-azulEscuro">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link href="/crm" onClick={onNavigate}>
          <Image
            src="/media/logo/logo.png"
            alt="Immovi Contabilidade"
            width={2432}
            height={613}
            className="h-7 w-auto"
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {LINKS.map(({ href, label, icon: Icon, exact }) => {
            const ativo = exact ? pathname === href : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    ativo
                      ? 'bg-verde/15 text-verde'
                      : 'text-brancoFrio/70 hover:bg-white/5 hover:text-brancoFrio'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="mb-3 px-1">
          <p className="text-xs text-brancoFrio/45">Conectado como</p>
          <p className="truncate text-sm font-medium text-brancoFrio">{nome || email}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={saindo}
          className="flex w-full items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-brancoFrio/80 transition-colors hover:border-verde hover:text-verde disabled:opacity-60"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </div>
  )
}

export default function CrmSidebar({
  email,
  nome,
}: {
  email: string
  nome?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [saindo, setSaindo] = useState(false)
  const [mobileAberto, setMobileAberto] = useState(false)

  async function logout() {
    setSaindo(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
    router.refresh()
  }

  return (
    <>
      {/* Sidebar fixo — desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 md:flex md:flex-col">
        <SidebarConteudo
          email={email}
          nome={nome}
          saindo={saindo}
          onLogout={logout}
          pathname={pathname}
        />
      </aside>

      {/* Topbar — mobile */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-azulEscuro px-4 md:hidden">
        <Link href="/crm">
          <Image
            src="/media/logo/logo.png"
            alt="Immovi Contabilidade"
            width={2432}
            height={613}
            className="h-6 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setMobileAberto(true)}
          className="rounded-lg p-2 text-brancoFrio hover:bg-white/10"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Overlay + drawer — mobile */}
      {mobileAberto && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileAberto(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64">
            <div className="relative h-full">
              <button
                type="button"
                onClick={() => setMobileAberto(false)}
                className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-brancoFrio/70 hover:bg-white/10"
                aria-label="Fechar menu"
              >
                <X size={18} />
              </button>
              <SidebarConteudo
                email={email}
                nome={nome}
                onNavigate={() => setMobileAberto(false)}
                saindo={saindo}
                onLogout={logout}
                pathname={pathname}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
