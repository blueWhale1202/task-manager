import { DATABASE_ID, WORKSPACE_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Workspace } from "@/types";

export const getWorkspaceInfo = async (workspaceId: string) => {
    const { databases } = await createSessionClient();

    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId,
    );

    return {
        name: workspace.name,
    };
};
