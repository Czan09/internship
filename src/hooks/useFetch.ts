import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import apiClient from '../lib/api/client';

interface UseFetchOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
}

export const useFetch = <T>(
  url: string,
  options: UseFetchOptions = {}
) => {
  const { enabled = true, refetchOnMount = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<T>(url);
      setData(response.data);
    } catch (err) {
      setError(err as AxiosError);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    if (refetchOnMount) {
      fetchData();
    }
  }, [fetchData, refetchOnMount]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};