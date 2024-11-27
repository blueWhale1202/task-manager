import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/lib/utils";
import { getMembersInfo } from "@/features/members/queries/get-members-info";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Member, Project, Task, TaskStatus } from "@/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { taskSchema } from "../schemas";

export const tasks = new Hono()
    .post("/", sessionMiddleware, zValidator("json", taskSchema), async (c) => {
        const user = c.get("user");
        const databases = c.get("databases");

        const {
            name,
            description,
            projectId,
            dueDate,
            assigneeId,
            status,
            workspaceId,
        } = c.req.valid("json");

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

        const highestPositionTask = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal("status", status),
                Query.equal("workspaceId", workspaceId),
                Query.orderAsc("position"),
                Query.limit(1),
            ],
        );

        const newPosition =
            highestPositionTask.documents.length > 0
                ? highestPositionTask.documents[0].position + 1000
                : 1000;

        const task = await databases.createDocument(
            DATABASE_ID,
            TASKS_ID,
            ID.unique(),
            {
                name,
                description,
                projectId,
                dueDate,
                assigneeId,
                status,
                workspaceId,
                position: newPosition,
            },
        );

        return c.json({ data: task });
    })
    .get(
        "/",
        sessionMiddleware,
        zValidator(
            "query",
            z.object({
                workspaceId: z.string(),
                projectId: z.string().nullish(),
                assigneeId: z.string().nullish(),
                status: z.nativeEnum(TaskStatus).nullish(),
                dueDate: z.string().nullish(),
                search: z.string().nullish(),
            }),
        ),
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");

            const {
                workspaceId,
                projectId,
                assigneeId,
                status,
                dueDate,
                search,
            } = c.req.valid("query");

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

            const query = [
                Query.equal("workspaceId", workspaceId),
                Query.orderDesc("$createdAt"),
            ];

            [projectId, assigneeId, status, dueDate].forEach((filter) => {
                if (filter) {
                    const filterName = Object.keys({ filter })[0];
                    console.log(filterName, filter);
                    query.push(Query.equal(filterName, filter));
                }
            });

            if (search) {
                console.log("search", search);
                query.push(Query.search("search", search));
            }

            const tasks = await databases.listDocuments<Task>(
                DATABASE_ID,
                TASKS_ID,
                query,
            );

            const projectIds = tasks.documents.map((task) => task.projectId);
            const assigneeIds = tasks.documents.map((task) => task.assigneeId);

            const projects = await databases.listDocuments<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                projectIds.length > 0
                    ? [Query.contains("$id", projectIds)]
                    : [],
            );

            const members = await databases.listDocuments<Member>(
                DATABASE_ID,
                MEMBERS_ID,
                assigneeIds.length > 0
                    ? [Query.contains("$id", assigneeIds)]
                    : [],
            );

            const assignees = await getMembersInfo(members);

            const populatedTasks = tasks.documents.map((task) => {
                const project = projects.documents.find(
                    (p) => p.$id === task.projectId,
                );
                const assignee = assignees.find(
                    (a) => a.$id === task.assigneeId,
                );

                return {
                    ...task,
                    project,
                    assignee,
                };
            });

            return c.json({
                data: {
                    ...tasks,
                    documents: populatedTasks,
                },
            });
        },
    );
