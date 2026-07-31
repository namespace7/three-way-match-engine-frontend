export interface SKU {
  id: string;
  skuCode: string;
  name: string;
  description?: string;
  unitPrice: number;
  unitOfMeasure: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSKUDto {
  skuCode: string;
  name: string;
  description?: string;
  unitPrice: number;
  unitOfMeasure: string;
  category?: string;
}

export type UpdateSKUDto = Partial<CreateSKUDto>;
