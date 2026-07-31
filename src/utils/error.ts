import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown, fallbackMessage = 'An unexpected error occurred.'): string => {
  if (!error) return fallbackMessage;

  if (error instanceof AxiosError || (typeof error === 'object' && error !== null && 'response' in error)) {
    const axiosErr = error as AxiosError<{ message?: string; error?: string }>;
    const responseData = axiosErr.response?.data;

    if (responseData) {
      if (typeof responseData.message === 'string' && responseData.message.trim() !== '') {
        return responseData.message;
      }
      if (typeof responseData.error === 'string' && responseData.error.trim() !== '') {
        return responseData.error;
      }
    }

    if (axiosErr.message && axiosErr.message.trim() !== '') {
      return axiosErr.message;
    }
  }

  if (error instanceof Error && error.message && error.message.trim() !== '') {
    return error.message;
  }

  if (typeof error === 'string' && error.trim() !== '') {
    return error;
  }

  return fallbackMessage;
};

export default getErrorMessage;
