'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Category } from '@/lib/types'
import { apiFetch } from '@/lib/api'
import Loader from '@/components/Loader'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await apiFetch('/categorias')
        // Manejar diferentes formatos de respuesta
        const categoriesList = Array.isArray(response) 
          ? response 
          : (response.data ?? response.rows ?? [])
        setCategories(categoriesList)
      } catch (err) {
        console.error('Error cargando categorías:', err)
        setError('Error al cargar las categorías')
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light text-white tracking-tight">Categorías</h1>
        <Link
          href="/admin/categories/create"
          className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 transition-colors text-sm font-medium"
        >
          Nueva Categoría
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 text-center">
          {error}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No hay categorías registradas</p>
          <Link
            href="/admin/categories/create"
            className="mt-4 inline-block px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Crear primera categoría
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((cat, index) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {cat.description || <span className="text-gray-400 italic">Sin descripción</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/admin/categories/edit/${cat.id}`}
                      className="text-gray-700 hover:text-gray-900 font-medium transition-colors underline-offset-2 hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
