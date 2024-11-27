import { EditWorkspaceForm } from "@/features/workspace/components/edit-workspace-form";
import { getWorkspace } from "@/features/workspace/queries/get-workspace";
import { redirect } from "next/navigation";

type Props = {
    params: {
        workspaceId: string;
    };
};

export default async function WorkspaceSettingPage({ params }: Props) {
    const { workspaceId } = params;

    const initialData = await getWorkspace(workspaceId);

    if (!initialData) {
        redirect(`/`);
    }

    return (
        <div className="size-full lg:max-w-xl">
            <EditWorkspaceForm initialData={initialData} />
        </div>
    );
}
