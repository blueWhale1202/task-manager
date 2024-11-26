import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config";
import { AUTH_COOKIE_NAME } from "@/features/auth/constants";
import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";

export const getWorkspaces = async () => {
    try {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        const session = cookies().get(AUTH_COOKIE_NAME);
        if (!session || !session.value) {
            return { documents: [], total: 0 };
        }

        client.setSession(session.value);

        const account = new Account(client);
        const databases = new Databases(client);
        const user = await account.get();

        const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
            Query.equal("userId", user.$id),
        ]);

        if (members.total === 0) {
            return { documents: [], total: 0 };
        }

        const workspaceIds = members.documents.map(
            (member) => member.workspaceId,
        );

        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACE_ID,
            [
                Query.contains("$id", workspaceIds),
                Query.orderDesc("$createdAt"),
            ],
        );

        return workspaces;
    } catch (error) {
        return { documents: [], total: 0 };
    }
};
