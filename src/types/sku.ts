export type SkuStatus = 'ACTIVE' | 'INACTIVE';

export interface SKUAlias {
  code: string;
  vendorGstin?: string | null;
}

export interface SKU {
  id?: string;
  _id?: string;
  skuCode: string;
  name: string;
  description?: string;
  unitPrice: number;
  tolerancePercent?: number;
  priceTolerance?: number;
  unitOfMeasure?: string;
  unit?: string;
  category?: string;
  status?: SkuStatus;
  isActive?: boolean;
  aliases?: SKUAlias[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSKUDto {
  skuCode: string;
  name: string;
  description?: string;
  unitPrice: number;
  tolerancePercent?: number;
  priceTolerance?: number;
  unitOfMeasure?: string;
  unit?: string;
  category?: string;
  status?: SkuStatus;
  isActive?: boolean;
  aliases?: SKUAlias[];
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
