// app/products/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import Loader from '@/components/Loader';
import { Product } from '@/lib/types';
import { apiFetch } from '@/lib/api';

interface PaginatedResponse {
  data: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{
    total: number;
    totalPages: number;
    currentPage: number;
  }>({
    total: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const fetchProducts = async (catId?: number | null, pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      query.set('page', String(pageNum));
      query.set('limit', '12');
      if (catId) query.set('category_id', String(catId));

      const response = await apiFetch(`/products?${query.toString()}`);
      
      // La respuesta puede venir en diferentes formatos
      let productsData: Product[] = [];
      let paginationData = {
        total: 0,
        totalPages: 1,
        currentPage: 1,
      };

      if (Array.isArray(response)) {
        productsData = response;
      } else if (response && typeof response === 'object') {
        // Si viene con pagination
        if ('pagination' in response) {
          productsData = response.data ?? response.rows ?? [];
          paginationData = {
            total: response.pagination?.total ?? 0,
            totalPages: response.pagination?.pages ?? response.pagination?.totalPages ?? 1,
            currentPage: response.pagination?.page ?? response.pagination?.currentPage ?? 1,
          };
        } else {
          productsData = response.data ?? response.rows ?? [];
        }
      }

      setProducts(productsData);
      setPagination(paginationData);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los productos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Leer categoría de la URL al cargar
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const catId = parseInt(categoryParam, 10);
      if (!isNaN(catId)) {
        setCategoryId(catId);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts(categoryId, page);
  }, [categoryId, page]);

  const handleCategoryChange = (id: number | null) => {
    setCategoryId(id);
    setPage(1); // Reset to first page when changing category
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((current) => current - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) {
      setPage((current) => current + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-light text-gray-900 tracking-tight mb-8">Productos</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <CategoryFilter onChange={handleCategoryChange} value={categoryId} />
        <div className="text-sm text-gray-500 font-medium">
          ✨
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-center p-4 mb-6 bg-red-50 border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          No se encontraron productos
          {categoryId && ' para esta categoría'}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`px-4 py-2 border border-gray-200 transition-colors text-sm font-medium ${
              page === 1
                ? 'text-gray-300 cursor-not-allowed border-gray-100'
                : 'text-gray-700 hover:border-gray-900 hover:text-gray-900'
            }`}
          >
            Anterior
          </button>
          <div className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700">
            {page} de {pagination.totalPages}
          </div>
          <button
            onClick={handleNextPage}
            disabled={page >= pagination.totalPages}
            className={`px-4 py-2 border border-gray-200 transition-colors text-sm font-medium ${
              page >= pagination.totalPages
                ? 'text-gray-300 cursor-not-allowed border-gray-100'
                : 'text-gray-700 hover:border-gray-900 hover:text-gray-900'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductsContent />
    </Suspense>
  );
}
