import api from './api';
import { DocumentType } from '@/types/document';

export interface UploadDocumentParams {
  file: File;
  documentType: DocumentType;
  onUploadProgress?: (progressPercent: number) => void;
}

export interface UploadDocumentResponse {
  success: boolean;
  data?: Record<string, unknown>;
  message?: string;
}

export const uploadDocument = async ({
  file,
  documentType,
  onUploadProgress,
}: UploadDocumentParams): Promise<UploadDocumentResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);

  const response = await api.post<UploadDocumentResponse>('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onUploadProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    },
  });

  return response.data;
};

export default uploadDocument;
