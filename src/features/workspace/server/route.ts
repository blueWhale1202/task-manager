import {
    DATABASE_ID,
    IMAGES_BUCKET_ID,
    MEMBERS_ID,
    WORKSPACE_ID,
} from "@/config";
import { MemberRole } from "@/features/members/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInvitedCode } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { workspaceSchema } from "../schemas";

export const workspace = new Hono()
    .get("/", sessionMiddleware, async (c) => {
        const databases = c.get("databases");
        const user = c.get("user");

        const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
            Query.equal("userId", user.$id),
        ]);

        if (members.total === 0) {
            return c.json({ data: { documents: [], total: 0 } });
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

        return c.json({ data: workspaces });
    })
    .post(
        "/",
        zValidator("form", workspaceSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");
            const storage = c.get("storage");

            const { name, image } = c.req.valid("form");

            let uploadedImage: string | undefined;

            if (image instanceof Blob) {
                const fileId = ID.unique();
                let extension = image.type.split("/")[1];

                const file = new File(
                    [image],
                    `${name}_${fileId}.${extension}`,
                    {
                        type: image.type,
                    },
                );

                const fileUploaded = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    fileId,
                    file,
                );

                const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    fileUploaded.$id,
                );
                uploadedImage = `data:${image.type};base64,${Buffer.from(arrayBuffer).toString("base64")}`;
            }

            const workspace = await databases.createDocument(
                DATABASE_ID,
                WORKSPACE_ID,
                ID.unique(),
                {
                    name,
                    userId: user.$id,
                    imageUrl: uploadedImage,
                    inviteCode: generateInvitedCode(),
                },
            );

            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    userId: user.$id,
                    workspaceId: workspace.$id,
                    role: MemberRole.ADMIN,
                },
            );

            return c.json({ data: workspace });
        },
    );
