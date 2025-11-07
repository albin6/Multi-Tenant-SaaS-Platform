import { useAuth } from '@clerk/nextjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { User, UpdateUserData, ApiResponse } from '@/types';

/**
 * Custom hook to set auth token in API client
 */
export function useApiAuth() {
  const { getToken } = useAuth();

  const setToken = async () => {
    const token = await getToken();
    apiClient.setAuthToken(token);
    return token;
  };

  return { setToken };
}

/**
 * Hook to fetch current user profile
 */
export function useCurrentUser() {
  const { setToken } = useApiAuth();

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      await setToken();
      const response = await apiClient.get<ApiResponse<{ user: User }>>('/users/me');
      return response.data?.user;
    },
  });
}

/**
 * Hook to update current user profile
 */
export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();
  const { setToken } = useApiAuth();

  return useMutation({
    mutationFn: async (data: UpdateUserData) => {
      await setToken();
      const response = await apiClient.patch<ApiResponse<{ user: User }>>('/users/me', data);
      return response.data?.user;
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
}

/**
 * Hook to verify session
 */
export function useVerifySession() {
  const { setToken } = useApiAuth();

  return useQuery({
    queryKey: ['auth', 'verify'],
    queryFn: async () => {
      await setToken();
      const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/verify');
      return response.data?.user;
    },
    retry: false,
  });
}

/**
 * Hook to fetch user by ID
 */
export function useUser(userId: string) {
  const { setToken } = useApiAuth();

  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      await setToken();
      const response = await apiClient.get<ApiResponse<{ user: User }>>(`/users/${userId}`);
      return response.data?.user;
    },
    enabled: !!userId,
  });
}
