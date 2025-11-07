// app/admin/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import Loader from '@/components/Loader';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/products?limit=100');
      // La respuesta puede venir como array o como objeto con pagination
      const productList = Array.isArray(response) ? response : (response.data ?? response.rows ?? []);
      console.log('Productos cargados:', productList); // Para debug
      setProducts(productList);
    } catch (err) {
      console.error('Error cargando productos:', err);
      alert('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Recargar productos cuando la página recibe el foco
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', load);
      return () => window.removeEventListener('focus', load);
    }
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro que desea eliminar este producto?')) return;
    
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      await load(); // Recargamos la lista completa después de eliminar
    } catch (err) {
      console.error('Error eliminando producto:', err);
      alert('Error al eliminar el producto');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light text-white tracking-tight">Panel Administrativo</h2>
        <Link href="/admin/create" className="px-4 py-2 bg-gray-900 text-gray-100 hover:bg-gray-500 transition-colors text-sm font-medium">Crear producto</Link>
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {products.map((prod) => (
            <div key={prod.id} className="bg-pink-200 border border-gray-100 p-5 rounded-md">
       <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1 ">{prod.name}</h3>
                  <p className="text-sm text-gray-700">${prod.price}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link 
                  href={`/admin/edit/${prod.id}`} 
                  className="text-sm px-3 py-2 border border-gray-600 text-gray-700 rounded-lg hover:border-gray-500 hover:text-gray-400 transition-colors font-medium"
                >
                  Editar
                </Link>
                <button 
                  onClick={() => handleDelete(prod.id!)} 
                  className="text-sm px-3 py-2 border border-red-800 text-red-400 rounded-lg hover:border-red-600 hover:text-red-300 transition-colors font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
