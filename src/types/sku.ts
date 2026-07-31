export type SkuStatus = 'ACTIVE' | 'INACTIVE';

export interface SKU {
  id: string;
  skuCode: string;
  name: string;
  description?: string;
  unitPrice: number;
  tolerancePercent?: number;
  unitOfMeasure: string;
  category?: string;
  status: SkuStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSKUDto {
  skuCode: string;
  name: string;
  description?: string;
  unitPrice: number;
  tolerancePercent?: number;
  unitOfMeasure: string;
  category?: string;
  status: SkuStatus;
}

export type UpdateSKUDto = Partial<CreateSKUDto>;

export interface SkuResponse {
  success: boolean;
  data: SKU | SKU[];
  message?: string;
}

export interface SkuFilterState {
  searchCode: string;
  searchName: string;
  status: 'ALL' | 'ACTIVE' | 'INACTIVE';
}
