'use client'

import { useState } from 'react'
import { createCategory } from '@/lib/api'
import CategoryForm from '@/components/CategoryForm'
import { useRouter } from 'next/navigation'

export default function CreateCategoryPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: { nombre: string; descripcion?: string }) => {
    try {
      // Transform the form data to match the API format
      const categoryData = {
        name: data.nombre.trim(),
        description: data.descripcion?.trim() || null,
        is_active: true
      }

      await createCategory(categoryData)
      router.push('/admin/categories')
    } catch (err) {
      console.error('Error creating category:', err)
      setError(err instanceof Error ? err.message : 'Error al crear la categoría')
    }
  }

  return (
    <main className="p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nueva Categoría</h1>
      
      <CategoryForm 
        onSubmit={handleSubmit}
        initialData={{
          nombre: '',
          descripcion: ''
        }}
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => router.push('/admin/categories')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Volver a categorías
        </button>
      </div>
    </main>
  )
}
