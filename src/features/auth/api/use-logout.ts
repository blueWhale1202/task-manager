import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async () => {
            const response = await api.auth.logout.$post();

            if (!response.ok) {
                throw new Error("Failed to logout");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["current"],
            });
            queryClient.invalidateQueries({
                queryKey: ["workspaces"],
            });
            router.push("/sign-in");
        },
    });
    return mutation;
};
