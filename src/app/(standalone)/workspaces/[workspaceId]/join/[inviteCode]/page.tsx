import { JoinWorkspaceForm } from "@/features/workspace/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspace/queries/get-workspace-info";
import { redirect } from "next/navigation";

type Props = {
    params: {
        workspaceId: string;
        inviteCode: string;
    };
};

export default async function InvitePage({ params }: Props) {
    const { workspaceId, inviteCode } = params;

    const info = await getWorkspaceInfo(workspaceId);

    if (!info) {
        redirect("/");
    }

    return (
        <div className="w-full lg:max-w-xl">
            <JoinWorkspaceForm
                initialValues={{ name: info.name, workspaceId, inviteCode }}
            />
        </div>
    );
}
