import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import apiClient from '@/lib/api/client';

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
}

export const useMutation = <TData = any, TVariables = any>(
  url: string,
  method: HttpMethod = 'POST',
  options: UseMutationOptions<TData> = {}
) => {
  const { onSuccess, onError } = options;
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const mutate = useCallback(
    async (variables?: TVariables) => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        switch (method) {
          case 'POST':
            response = await apiClient.post<TData>(url, variables);
            break;
          case 'PUT':
            response = await apiClient.put<TData>(url, variables);
            break;
          case 'PATCH':
            response = await apiClient.patch<TData>(url, variables);
            break;
          case 'DELETE':
            response = await apiClient.delete<TData>(url);
            break;
        }

        setData(response.data);
        onSuccess?.(response.data);
        return { success: true, data: response.data };
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        onError?.(axiosError);
        return { success: false, error: axiosError };
      } finally {
        setLoading(false);
      }
    },
    [url, method, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, data, loading, error, reset };
};