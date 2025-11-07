'use client'

import { useEffect, useState } from 'react'
import { getCategoryById, updateCategory } from '@/lib/api'
import { useParams, useRouter } from 'next/navigation'
import CategoryForm from '@/components/CategoryForm'
import { Category } from '@/lib/types'

export default function EditCategoryPage() {
  const { id } = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCategory() {
      if (!id) return
      
      try {
        const categoryId = Array.isArray(id) ? id[0] : id
        const data = await getCategoryById(categoryId)
        setCategory(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la categoría')
      } finally {
        setIsLoading(false)
      }
    }

    loadCategory()
  }, [id])

  const handleSubmit = async (data: { nombre: string; descripcion?: string }) => {
    if (!id) return

    try {
      const categoryId = Array.isArray(id) ? id[0] : id
      await updateCategory(categoryId, {
        name: data.nombre,
        description: data.descripcion || null
      })
      router.push('/admin/categories')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la categoría')
    }
  }

  if (isLoading) {
    return <p className="text-center mt-10">Cargando...</p>
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.push('/admin/categories')}
          className="text-pink-500 hover:text-pink-600"
        >
          Volver a categorías
        </button>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center mt-10">
        <p className="mb-4">No se encontró la categoría</p>
        <button
          onClick={() => router.push('/admin/categories')}
          className="text-pink-500 hover:text-pink-600"
        >
          Volver a categorías
        </button>
      </div>
    )
  }

  const initialData = {
    nombre: category.name,
    descripcion: category.description || ''
  }

  return (
    <main className="p-8">
      <CategoryForm 
        initialData={initialData} 
        onSubmit={handleSubmit}
      />
    </main>
  )
}
