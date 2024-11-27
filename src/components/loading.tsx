import { Loader } from "lucide-react";

export const Loading = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
    );
};
