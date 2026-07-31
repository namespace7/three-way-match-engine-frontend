import api from './api';

export interface HealthResponse {
  status: string;
  timestamp?: string;
  uptime?: number;
  message?: string;
}

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/health');
  return response.data;
};

export default getHealth;
