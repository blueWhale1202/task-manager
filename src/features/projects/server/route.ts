import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/lib/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Project } from "@/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { projectSchema } from "../schemas";

export const projects = new Hono()
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");

            const { workspaceId } = c.req.valid("query");

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

            const projects = await databases.listDocuments<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                [
                    Query.equal("workspaceId", workspaceId),
                    Query.orderDesc("$createdAt"),
                ],
            );

            return c.json({ data: projects });
        },
    )
    .post(
        "/",
        sessionMiddleware,
        zValidator("form", projectSchema),
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");
            const storage = c.get("storage");

            const { name, workspaceId, image } = c.req.valid("form");

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

            let uploadedImage: string | undefined;

            if (image instanceof Blob) {
                const fileId = ID.unique();
                const extension = image.type.split("/")[1];
                const file = new File(
                    [image],
                    `${name}_${fileId}.${extension}`,
                    { type: image.type },
                );

                const fileUpload = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    fileId,
                    file,
                );
                const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    fileUpload.$id,
                );
                uploadedImage = `data:${image.type};base64,${Buffer.from(arrayBuffer).toString("base64")}`;
            }

            const project = await databases.createDocument<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                ID.unique(),
                {
                    name,
                    workspaceId,
                    imageUrl: uploadedImage,
                },
            );

            return c.json({ data: project });
        },
    )
    .patch(
        "/:projectId",
        sessionMiddleware,
        zValidator("form", projectSchema),
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");
            const storage = c.get("storage");

            const { name, image } = c.req.valid("form");
            const { projectId } = c.req.param();

            const project = await databases.getDocument<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                projectId,
            );

            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId: project.workspaceId,
            });

            if (!member) {
                return c.json(
                    { message: "You are not a member of this workspace" },
                    403,
                );
            }

            let uploadedImage: string | undefined;

            if (image instanceof Blob) {
                const fileId = ID.unique();
                const extension = image.type.split("/")[1];
                const file = new File(
                    [image],
                    `${name}_${fileId}.${extension}`,
                    {
                        type: image.type,
                    },
                );

                const fileUpload = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    fileId,
                    file,
                );
                const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    fileUpload.$id,
                );
                uploadedImage = `data:${image.type};base64,${Buffer.from(arrayBuffer).toString("base64")}`;
            } else {
                uploadedImage = image;
            }

            const updatedProject = await databases.updateDocument<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                projectId,
                {
                    name,
                    imageUrl: uploadedImage,
                },
            );

            return c.json({ data: updatedProject });
        },
    )
    .delete("/:projectId", sessionMiddleware, async (c) => {
        const databases = c.get("databases");
        const user = c.get("user");

        const { projectId } = c.req.param();

        const project = await databases.getDocument<Project>(
            DATABASE_ID,
            PROJECTS_ID,
            projectId,
        );

        const member = await getMember({
            databases,
            userId: user.$id,
            workspaceId: project.workspaceId,
        });

        if (!member) {
            return c.json(
                { message: "You are not a member of this workspace" },
                403,
            );
        }

        await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

        return c.json({ data: { $id: projectId } });
    });
