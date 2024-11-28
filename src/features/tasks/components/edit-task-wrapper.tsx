"use client";

import { Card, CardContent } from "@/components/ui/card";

import { Loader } from "lucide-react";
import { EditTaskForm } from "./edit-task-form";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspace/hooks/use-workspace-id";
import { useGetTask } from "../api/use-get-task";

type Props = {
    onCancel: () => void;
    id: string;
};

export const EditTaskWrapper = ({ onCancel, id }: Props) => {
    const workspaceId = useWorkspaceId();

    const projects = useGetProjects(workspaceId);
    const members = useGetMembers(workspaceId);
    const tasks = useGetTask(id);

    const isLoading =
        projects.isLoading || members.isLoading || tasks.isLoading;

    if (isLoading) {
        return (
            <Card className="h-[714px] w-full border-none shadow-none">
                <CardContent className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    const projectOptions = projects.data?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl,
    }));

    const memberOptions = members.data?.documents.map((member) => ({
        id: member.$id,
        name: member.name,
    }));

    if (!tasks.data) {
        return null;
    }

    return (
        <EditTaskForm
            onCancel={onCancel}
            projectOptions={projectOptions ?? []}
            memberOptions={memberOptions ?? []}
            initialData={tasks.data}
        />
    );
};
