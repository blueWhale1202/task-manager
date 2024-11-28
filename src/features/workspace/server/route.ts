import {
    DATABASE_ID,
    IMAGES_BUCKET_ID,
    MEMBERS_ID,
    WORKSPACE_ID,
} from "@/config";
import { getMember } from "@/features/members/lib/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInvitedCode } from "@/lib/utils";
import { MemberRole, Workspace } from "@/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
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
    .get("/:workspaceId", sessionMiddleware, async (c) => {
        const databases = c.get("databases");
        const user = c.get("user");

        const { workspaceId } = c.req.param();

        const member = await getMember({
            databases,
            userId: user.$id,
            workspaceId,
        });

        if (!member) {
            return c.json(
                { message: "You are not a member of this workspace" },
                403,
            );
        }

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACE_ID,
            workspaceId,
        );

        if (!workspace) {
            return c.json({ message: "Workspace not found" }, 404);
        }

        return c.json({ data: workspace });
    })
    .get("/:workspaceId/info", sessionMiddleware, async (c) => {
        const databases = c.get("databases");

        const { workspaceId } = c.req.param();

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACE_ID,
            workspaceId,
        );

        if (!workspace) {
            return c.json({ message: "Workspace not found" }, 404);
        }

        return c.json({
            data: {
                $id: workspace.$id,
                name: workspace.name,
            },
        });
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
    )
    .patch(
        "/:workspaceId",
        sessionMiddleware,
        zValidator("form", workspaceSchema),
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");
            const storage = c.get("storage");

            const { name, image } = c.req.valid("form");
            const { workspaceId } = c.req.param();

            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId,
            });

            if (!member || member.role !== MemberRole.ADMIN) {
                return c.json(
                    { message: "You are not allowed to perform this action" },
                    403,
                );
            }

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
            } else {
                uploadedImage = image;
            }

            const workspace = await databases.updateDocument(
                DATABASE_ID,
                WORKSPACE_ID,
                workspaceId,
                {
                    name,
                    imageUrl: uploadedImage,
                },
            );

            return c.json({ data: workspace });
        },
    )
    .delete("/:workspaceId", sessionMiddleware, async (c) => {
        const databases = c.get("databases");
        const user = c.get("user");

        const { workspaceId } = c.req.param();

        const member = await getMember({
            databases,
            userId: user.$id,
            workspaceId,
        });

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json(
                { message: "You are not allowed to perform this action" },
                403,
            );
        }

        await databases.deleteDocument(DATABASE_ID, WORKSPACE_ID, workspaceId);

        return c.json({ data: { $id: workspaceId } });
    })
    .post("/:workspaceId/reset-code", sessionMiddleware, async (c) => {
        const databases = c.get("databases");
        const user = c.get("user");

        const { workspaceId } = c.req.param();

        const member = await getMember({
            databases,
            userId: user.$id,
            workspaceId,
        });

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json(
                { message: "You are not allowed to perform this action" },
                403,
            );
        }

        const workspace = await databases.updateDocument(
            DATABASE_ID,
            WORKSPACE_ID,
            workspaceId,
            {
                inviteCode: generateInvitedCode(),
            },
        );

        return c.json({ data: workspace });
    })
    .post(
        "/:workspaceId/join",
        sessionMiddleware,
        zValidator(
            "json",
            z.object({
                code: z.string().length(6),
            }),
        ),
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const { workspaceId } = c.req.param();
            const { code } = c.req.valid("json");

            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId,
            });

            if (member) {
                return c.json(
                    { message: "You are already a member of this workspace" },
                    400,
                );
            }

            const workspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACE_ID,
                workspaceId,
            );

            if (!workspace) {
                return c.json({ message: "Workspace not found" }, 404);
            }

            if (workspace.inviteCode !== code) {
                return c.json({ message: "Invalid code" }, 400);
            }

            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    userId: user.$id,
                    workspaceId,
                    role: MemberRole.MEMBER,
                },
            );

            return c.json({ data: workspace });
        },
    );
