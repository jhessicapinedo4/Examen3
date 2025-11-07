// app/admin/edit/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import { Product } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import Loader from '@/components/Loader';

export default function AdminEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await apiFetch(`/products/${id}`);
        // La respuesta puede venir como objeto directo o dentro de data
        setProduct(res || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <div className="p-6">Producto no encontrado</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-pink-700 mb-4">Editar Producto</h2>
      <ProductForm initialData={product} onSuccess={() => router.push('/admin')} />
    </div>
  );
}
