// components/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="bg-white border border-gray-200 hover:border-gray-900 transition-colors overflow-hidden group">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-64 w-full bg-gray-100">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="group-hover:opacity-90 transition-opacity"
          />
        </div>
      </Link>

      <div className="p-5">
        <h3 className="text-base font-medium text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-900 font-medium">${product.price}</span>
          
        </div>
      </div>
    </article>
  );
}
