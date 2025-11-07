'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ShoppingBag, LayoutDashboard, Package, Tag } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const isAdmin = pathname.startsWith('/admin')

  // Enlaces para clientes (navegación pública)
  const clientLinks = [
    { href: '/', label: 'Inicio', icon: null },
    { href: '/products', label: 'Productos', icon: ShoppingBag },
  ]

  // Enlaces para administradores
  const adminLinks = [
    { href: '/admin', label: 'Panel Admin', icon: LayoutDashboard },
    { href: '/admin/create', label: 'Nuevo Producto', icon: Package },
    { href: '/admin/categories', label: 'Categorías', icon: Tag },
  ]

  // Enlaces actuales según el contexto
  const currentLinks = isAdmin ? adminLinks : clientLinks

  return (
    <nav className={` sticky top-0 z-50 border-b ${isAdmin ? 'bg-gray-900 border-gray-800' : 'bg-pink-200 border-gray-200'}`}>
      <div className=" max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href={isAdmin ? '/admin' : '/'} 
            className={`text-xl font-light  tracking-wide flex items-center gap-3 ${isAdmin ? 'text-white' : 'text-gray-900 font-medium '}`}
          >
            🎀 Chocolover
            {isAdmin && (
              <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded font-medium uppercase tracking-wider border border-gray-700">
                Admin
              </span>
            )}
          </Link>

          {/* Botón mobile */}
          <button
            className={`md:hidden ${isAdmin ? 'text-white' : 'text-gray-600'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Enlaces Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {currentLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || 
                (link.href !== '/' && pathname.startsWith(link.href))
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 transition-colors ${
                    isActive
                      ? isAdmin
                        ? 'text-white border-b-2 border-white'
                        : 'text-gray-900 border-b-2 border-gray-900'
                      : isAdmin
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {Icon && <Icon size={18} />}
                  <span>{link.label}</span>
                </Link>
              )
            })}

            {/* Botón para cambiar de contexto */}
            <Link
              href={isAdmin ? '/' : '/admin'}
              className={`ml-4 px-4 py-2 text-sm font-medium transition-colors ${
                isAdmin
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {isAdmin ? 'Ver Tienda' : 'Administración'}
            </Link>
          </div>
        </div>

        {/* Menú Mobile */}
        <div
          className={`${
            menuOpen ? 'block' : 'hidden'
          } md:hidden mt-4 pb-4 border-t ${isAdmin ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="flex flex-col space-y-2 mt-4">
            {currentLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || 
                (link.href !== '/' && pathname.startsWith(link.href))
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive
                      ? isAdmin
                        ? 'text-white border-l-2 border-white'
                        : 'text-gray-900 border-l-2 border-gray-900'
                      : isAdmin
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {Icon && <Icon size={20} />}
                  <span>{link.label}</span>
                </Link>
              )
            })}

            {/* Botón para cambiar de contexto en mobile */}
            <Link
              href={isAdmin ? '/' : '/admin'}
              className={`mt-4 px-4 py-3 text-center font-medium transition-colors ${
                isAdmin
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {isAdmin ? 'Ver Tienda' : 'Administración'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
