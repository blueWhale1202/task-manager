import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async () => {
            await api.auth.logout.$post();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["current"] });
            router.push("/sign-in");
        },
    });
    return mutation;
};
