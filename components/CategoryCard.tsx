import Link from 'next/link';
import { Category } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/products?category=${category.id}`}>
      <article className="group relative bg-gray-50 hover:bg-white border border-gray-200 hover:border-pink-600 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-pink-600 group-hover:text-pink-500 transition-colors duration-300">
            {category.name}
          </h3>
          <ChevronRight
            className="w-5 h-5 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all duration-300"
          />
        </div>

        {category.description ? (
          <p className="text-sm text-gray-600 group-hover:text-gray-900 leading-relaxed line-clamp-3 transition-colors duration-300">
            {category.description}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">Sin descripción</p>
        )}

        <div className="mt-6 flex items-center">
          <span className="text-xs font-semibold text-gray-400 group-hover:text-pink-600 transition-colors duration-300 uppercase tracking-widest">
            Ver productos
          </span>
        </div>
      </article>
    </Link>
  );
}
