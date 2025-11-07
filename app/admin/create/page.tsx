// app/admin/create/page.tsx
'use client';

import { useState } from 'react';
import ProductForm from '@/components/ProductForm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminCreatePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = () => {
    // Forzamos un refresh de la página de administración antes de redirigir
    router.refresh();
    router.push('/admin');
  };

  const handleError = (message: string) => {
    setError(message);
    // Auto-hide error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pink-700">Crear Producto</h2>
        <Link
          href="/admin"
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Volver al listado
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <ProductForm onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
}
