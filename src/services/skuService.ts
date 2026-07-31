import api from './api';
import { SKU, CreateSKUDto, UpdateSKUDto, SkuResponse } from '@/types/sku';

export const getSkus = async (): Promise<SKU[]> => {
  const response = await api.get<SkuResponse | SKU[]>('/api/v1/skus');
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data && 'data' in response.data) {
    const data = response.data.data;
    return Array.isArray(data) ? data : [data];
  }
  return [];
};

export const getSkuById = async (id: string): Promise<SKU> => {
  const response = await api.get<SkuResponse | SKU>(`/api/v1/skus/${encodeURIComponent(id)}`);
  if ('data' in response.data && response.data.data && !Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return response.data as SKU;
};

export const createSku = async (dto: CreateSKUDto): Promise<SKU> => {
  const response = await api.post<SkuResponse | SKU>('/api/v1/skus', dto);
  if ('data' in response.data && response.data.data && !Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return response.data as SKU;
};

export const updateSku = async ({ id, dto }: { id: string; dto: UpdateSKUDto }): Promise<SKU> => {
  const response = await api.patch<SkuResponse | SKU>(`/api/v1/skus/${encodeURIComponent(id)}`, dto);
  if ('data' in response.data && response.data.data && !Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return response.data as SKU;
};

export const deleteSku = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/skus/${encodeURIComponent(id)}`);
};

const skuService = {
  getSkus,
  getSkuById,
  createSku,
  updateSku,
  deleteSku,
};

export default skuService;
