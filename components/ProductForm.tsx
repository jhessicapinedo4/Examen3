// components/ProductForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { Category, Product } from '@/lib/types';
import { apiFetch } from '@/lib/api';

type FormErrors = {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  imageUrl?: string;
  categoryId?: string;
};

type Props = {
  initialData?: Product | null;
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export default function ProductForm({ initialData = null, onSuccess, onError }: Props) {
  // Form fields
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [price, setPrice] = useState(initialData?.price ?? '');
  const [stock, setStock] = useState(initialData?.stock ?? '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? '');
  const [categoryId, setCategoryId] = useState<number | ''>(initialData?.category_id ?? '');
  
  // UI states
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await apiFetch('/categorias');
      // La respuesta puede venir como array o como objeto con data
      const categoriesList = Array.isArray(res) ? res : (res.data ?? res ?? []);
      setCategories(categoriesList);
      setLoadingCategories(false);
    } catch (err) {
      console.error('Error loading categories:', err);
      onError?.('Error al cargar las categorías');
      setLoadingCategories(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    const stockNum = Number(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    // Validar category_id - es requerido
    if (categoryId === '' || !categoryId) {
      newErrors.categoryId = 'La categoría es requerida';
    }

    // Solo validamos la URL si se ha ingresado algún valor
    const trimmedImageUrl = imageUrl.trim();
    if (trimmedImageUrl !== '') {
      if (!isValidUrl(trimmedImageUrl)) {
        newErrors.imageUrl = 'La URL de la imagen no es válida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      onError?.('Por favor, corrija los errores en el formulario');
      return;
    }

    setSaving(true);
    try {
      // Para nuevos productos, si no se proporciona imagen, el backend la obtendrá automáticamente
      // Para ediciones, solo enviamos image_url si se proporcionó una nueva
      const payload: any = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        category_id: Number(categoryId), // Ya validamos que existe
      };

      // Solo incluir image_url si se proporcionó una (opcional)
      const trimmedImageUrl = imageUrl.trim();
      if (trimmedImageUrl) {
        payload.image_url = trimmedImageUrl;
      }
      // Si no se proporciona image_url y es un nuevo producto, el backend lo obtendrá automáticamente

      if (initialData?.id) {
        await apiFetch(`/products/${initialData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      onSuccess?.();
    } catch (err) {
      console.error('Error saving product:', err);
      onError?.(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre del producto
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2   ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Ej: Torta de chocolate"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2   ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Describe el producto..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Precio
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">S/. </span>
            </div>
            <input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`w-full pl-7 pr-4 py-2 border rounded-md shadow-sm focus:ring-2  ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2   ${
              errors.stock ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          URL de la imagen <span className="text-gray-500 text-xs">(opcional)</span>
        </label>
        <div className="mt-1">
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2   ${
              errors.imageUrl ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Dejar vacío para que el backend obtenga una imagen automáticamente"
          />
          <p className="mt-1 text-sm text-gray-500">
            Si no proporcionas una URL, el servidor obtendrá automáticamente una imagen desde una API externa (Lorem Picsum o FakeStore)
          </p>
        </div>
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
        )}
        {imageUrl && !errors.imageUrl && (
          <div className="mt-2 relative h-32 w-32 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={imageUrl}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Categoría <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={String(categoryId)}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
          className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2   ${
            errors.categoryId ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={loadingCategories}
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {loadingCategories && (
          <p className="mt-1 text-sm text-gray-500">Cargando categorías...</p>
        )}
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving || loadingCategories}
          className={`px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
            (saving || loadingCategories) && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {saving ? 'Guardando...' : 'Guardar producto'}
        </button>
      </div>
    </form>
  );
}
