import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACE_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { workspaceSchema } from "../schemas";

export const workspace = new Hono().post(
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
            if (extension.includes("svg")) {
                extension = "svg";
            }

            const file = new File([image], `${name}_${fileId}.${extension}`, {
                type: image.type,
            });

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
            },
        );

        return c.json(workspace);
    },
);
