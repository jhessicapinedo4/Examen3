// app/products/[id]/page.tsx
import { API_URL } from '@/lib/api';
import Image from 'next/image';
import { Product } from '@/lib/types';

type Props = { params: { id: string } };

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    // La respuesta puede venir como { success: true, data: {...} } o directamente como objeto
    return json.data ?? json ?? null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetail({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div className="p-8 text-center">Producto no encontrado</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="rounded-2xl overflow-hidden shadow">
          <Image
            src={product.image_url}
            alt={product.name}
            width={800}
            height={600}
            className="w-full h-96 object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-pink-700 mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="text-2xl font-semibold text-pink-600 mb-4">${product.price}</div>
          <div className="mb-4">Stock: {product.stock}</div>
          <div className="text-sm text-gray-500">
            Categoría: {product.category?.name ?? product.category_id ?? '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
