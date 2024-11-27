import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/lib/utils";
import { createSessionClient } from "@/lib/appwrite";
import { Project } from "@/types";

export const getProject = async (projectId: string) => {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
    );

    const member = await getMember({
        databases: databases,
        userId: user.$id,
        workspaceId: project.workspaceId,
    });

    if (!member) {
        throw new Error("You are not a member of this project");
    }

    return project;
};
