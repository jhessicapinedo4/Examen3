import Link from 'next/link'
import { getCategories } from '@/lib/api'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Categorías</h1>
        <Link
          href="/admin/categories/create"
          className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
        >
          + Nueva Categoría
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat: any, index: number) => (
              <tr key={cat.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{cat.description || '-'}</td>
                <td className="p-3">
                  <Link
                    href={`/admin/categories/edit/${cat.id}`}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
