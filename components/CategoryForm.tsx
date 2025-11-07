'use client'

import { useState, useEffect } from 'react'

interface CategoryFormProps {
  initialData?: { id?: string; nombre: string; descripcion?: string }
  onSubmit: (data: { nombre: string; descripcion?: string }) => Promise<void>
}

export default function CategoryForm({ initialData, onSubmit }: CategoryFormProps) {
  const [nombre, setNombre] = useState(initialData?.nombre || '')
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ nombre, descripcion })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md w-full max-w-lg mx-auto space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center">
        {initialData ? 'Editar Categoría' : 'Nueva Categoría'}
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className=" mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2"
          placeholder="Ej. Tortas personalizadas"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2"
          rows={3}
          placeholder="Breve descripción de la categoría"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-pink-500 text-white font-medium px-4 py-2 rounded-md w-full hover:bg-pink-600 transition"
      >
        {loading ? 'Guardando...' : 'Guardar Categoría'}
      </button>
    </form>
  )
}
