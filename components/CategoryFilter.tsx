// components/CategoryFilter.tsx
'use client';

import { useEffect, useState } from 'react';
import { Category } from '@/lib/types';
import { apiFetch } from '@/lib/api';

export default function CategoryFilter({ 
  onChange, 
  value 
}: { 
  onChange?: (id: number | null) => void;
  value?: number | null;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string>(value ? String(value) : '');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/categorias');
        // La respuesta puede venir como array o como objeto con data
        const categoriesList = Array.isArray(res) ? res : (res.data ?? res ?? []);
        setCategories(categoriesList);
      } catch (err) {
        console.error('Error cargando categorías', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Sincronizar con el valor externo
  useEffect(() => {
    if (value !== undefined) {
      setSelected(value ? String(value) : '');
    }
  }, [value]);

  const handle = (value: string) => {
    setSelected(value);
    const id = value ? Number(value) : null;
    onChange?.(id);
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">Filtrar:</label>
      <select
        className="px-4 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
        value={selected}
        onChange={(e) => handle(e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {loading && <div className="text-xs text-gray-400">Cargando...</div>}
    </div>
  );
}
