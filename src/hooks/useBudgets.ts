import { useFetch } from './useFetch';
import { useMutation } from './useMutation';
import { Budget } from '@/types/budget';

export const useBudgets = (userId?: number) => {
  const url = userId ? `/budgets?userId=${userId}` : '/budgets';
  
  const { data: budgets, loading, error, refetch } = useFetch<Budget[]>(url);
  
  const { mutate: createBudget, loading: creating } = useMutation<Budget, Omit<Budget, 'id'>>(
    '/budgets',
    'POST',
    {
      onSuccess: () => refetch(),
    }
  );

  const { mutate: updateBudget, loading: updating } = useMutation<Budget, Budget>(
    '/budgets',
    'PUT',
    {
      onSuccess: () => refetch(),
    }
  );

  const { mutate: deleteBudget, loading: deleting } = useMutation<void, void>(
    '/budgets',
    'DELETE',
    {
      onSuccess: () => refetch(),
    }
  );

  return {
    budgets: budgets || [],
    loading: loading || creating || updating || deleting,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refetch,
  };
};