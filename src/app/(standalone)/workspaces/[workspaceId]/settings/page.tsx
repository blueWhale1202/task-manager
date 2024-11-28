"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetWorkspace } from "@/features/workspace/api/use-get-workspace";
import { EditWorkspaceForm } from "@/features/workspace/components/edit-workspace-form";
import { useWorkspaceId } from "@/features/workspace/hooks/use-workspace-id";

export default function WorkspaceSettingPage() {
    const workspaceId = useWorkspaceId();

    const { data: initialData, isLoading } = useGetWorkspace(workspaceId);

    if (isLoading) {
        return <PageLoader />;
    }

    if (!initialData) {
        return <PageError message="Workspace not found" />;
    }

    return (
        <div className="size-full lg:max-w-xl">
            <EditWorkspaceForm initialData={initialData} />
        </div>
    );
}
