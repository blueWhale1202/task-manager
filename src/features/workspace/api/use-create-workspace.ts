import { api } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const create = api.workspace.$post;

type RequestType = InferRequestType<typeof create>;
type ResponseType = InferResponseType<typeof create>;

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form }) => {
            const response = await create({ form });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "An error occurred");
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Workspace created successfully");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
