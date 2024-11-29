import { InviteWorkspacePage } from "@/features/workspace/components/invite-workspace";
import { getWorkspace } from "@/features/workspace/queries/get-workspace";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: {
        workspaceId: string;
    };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const { workspaceId } = params;

    const workspace = await getWorkspace(workspaceId);

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: workspace.name,
        description: `Join ${workspace.name} to collaborate with your team and get things done together.`,
        openGraph: {
            images: [...previousImages],
        },
    };
}

export default function Page() {
    return <InviteWorkspacePage />;
}
