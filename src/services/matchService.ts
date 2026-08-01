import api from './api';
import { MatchData, MatchResponse } from '@/types/match';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001/api/v1';

export const getMatchByPoNumber = async (poNumber: string): Promise<MatchData> => {
  const response = await api.get<MatchResponse | MatchData>(`/match/${encodeURIComponent(poNumber)}`);
  
  if ('data' in response.data && response.data.data) {
    return response.data.data;
  }
  return response.data as MatchData;
};

export const getDocumentFileUrl = (documentId: string): string => {
  return `${API_BASE_URL}/documents/${encodeURIComponent(documentId)}/file`;
};

const matchService = {
  getMatchByPoNumber,
  getDocumentFileUrl,
};

export default matchService;
