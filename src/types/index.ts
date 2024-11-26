import { Models } from "node-appwrite";

export type AppwriteException = {
    message: string;
    code: number;
    type: string;
};

export type Workspace = Models.Document & {
    name: string;
    imageUrl: string;
    userId: string;
    inviteCode: string;
};
