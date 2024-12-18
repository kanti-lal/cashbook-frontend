import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, UpdateProfileData } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export const useProfile = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    staleTime: Infinity,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
