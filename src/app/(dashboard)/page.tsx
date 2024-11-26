import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features/workspace/components/create-workspace-form";

export default async function AppPage() {
    const user = await getCurrent();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div className="h-full bg-neutral-500 p-4">
            <CreateWorkspaceForm />
        </div>
    );
}
