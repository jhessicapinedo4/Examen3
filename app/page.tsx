// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import Loader from '@/components/Loader';
import { Product, Category } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import { Settings } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Cargar productos destacados (primeros 6)
        const productsRes = await apiFetch('/products?limit=6');
        const productsList = Array.isArray(productsRes) 
          ? productsRes 
          : (productsRes.data ?? productsRes.rows ?? []);
        setProducts(productsList);

        // Cargar categorías
        const categoriesRes = await apiFetch('/categorias');
        const categoriesList = Array.isArray(categoriesRes) 
          ? categoriesRes 
          : (categoriesRes.data ?? categoriesRes ?? []);
        setCategories(categoriesList);
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16 py-12">
        <h1 className="text-5xl md:text-6xl font-light mb-6 text-gray-900 tracking-tight">
          Chocolover
        </h1>
        <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto text-gray-500 font-light leading-relaxed mt-8">
          Pastelería online. Encuentra tortas, pasteles, galletas y postres artesanales.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-12">
          <Link 
            href="/products" 
            className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium tracking-wide"
          >
            Explorar productos
          </Link>
         
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Categorías Section */}
          {categories.length > 0 && (
            <section className="mb-20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-light text-gray-900 tracking-tight">Categorías</h2>
                <Link 
                  href="/products" 
                  className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Ver todas
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </section>
          )}

          {/* Productos Destacados Section */}
          {products.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-light text-gray-900 tracking-tight">Productos destacados</h2>
                <Link 
                  href="/products" 
                  className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Ver todos
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link 
                  href="/products" 
                  className="px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium tracking-wide inline-block"
                >
                  Ver todos los productos
                </Link>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
