import { DATABASE_ID, WORKSPACE_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Workspace } from "@/types";

export const getWorkspaceInfo = async (workspaceId: string) => {
    try {
        const { databases } = await createSessionClient();

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACE_ID,
            workspaceId,
        );

        return {
            name: workspace.name,
        };
    } catch (error) {
        return null;
    }
};
