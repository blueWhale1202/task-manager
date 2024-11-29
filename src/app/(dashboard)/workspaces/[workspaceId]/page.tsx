"use client";

import { Analytics } from "@/components/analytics";
import { PageError } from "@/components/page-error";

import { DotSeparator } from "@/components/dot-separator";
import { MembersList } from "@/features/members/components/member-list";
import { ProjectList } from "@/features/projects/components/projects-list";
import { TasksList } from "@/features/tasks/components/tasks-list";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetWorkspaceAnalytics } from "@/features/workspace/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/features/workspace/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Settings } from "lucide-react";
import { Fragment } from "react";

export default function WorkspacePage() {
    const workspaceId = useWorkspaceId();

    const analytics = useGetWorkspaceAnalytics(workspaceId);
    const tasks = useGetTasks({ workspaceId });
    const projects = useGetProjects(workspaceId);
    const members = useGetMembers(workspaceId);

    const isLoading =
        analytics.isLoading ||
        tasks.isLoading ||
        projects.isLoading ||
        members.isLoading;

    if (isLoading) {
        return <WorkspaceLoadingPage />;
    }

    if (!analytics.data || !tasks.data || !projects.data || !members.data) {
        return <PageError message="Failed to load workspace data" />;
    }

    return (
        <div className="flex h-full flex-col space-y-4">
            <Analytics data={analytics.data} />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <TasksList
                    data={tasks.data.documents}
                    total={tasks.data.total}
                />
                <div className="flex flex-col gap-4">
                    <ProjectList
                        data={projects.data.documents}
                        total={projects.data.total}
                    />
                    <MembersList
                        data={members.data.documents}
                        total={members.data.total}
                    />
                </div>
            </div>
        </div>
    );
}

export const WorkspaceLoadingPage = () => {
    return (
        <div className="flex h-full flex-col space-y-4">
            <div className="flex h-28 w-full gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                    <Fragment key={index}>
                        <Skeleton className="flex-1" />
                    </Fragment>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="col-span-1 flex flex-col gap-y-4">
                    <div className="rounded-lg bg-muted p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold">Tasks</p>
                            <Button variant="muted" size="icon" disabled>
                                <Plus className="text-neutral-400" />
                            </Button>
                        </div>
                        <DotSeparator className="my-4" />
                        <ul className="flex h-[50vh] flex-col gap-y-4">
                            {[1, 2, 3, 4].map((index) => (
                                <li key={index}>
                                    <Skeleton className="h-20 w-full" />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="col-span-1 flex flex-col gap-y-4">
                        <div className="rounded-lg border bg-white p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold">
                                    Projects
                                </p>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    disabled
                                >
                                    <Plus className="text-neutral-400" />
                                </Button>
                            </div>
                            <DotSeparator className="my-4" />
                            <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <li key={index}>
                                        <Skeleton className="h-20 w-full" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-span-1 flex flex-col gap-y-4">
                            <div className="rounded-lg border bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-semibold">
                                        Members
                                    </p>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        disabled
                                    >
                                        <Settings className="text-neutral-400" />
                                    </Button>
                                </div>
                                <DotSeparator className="my-4" />
                                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {[1, 2, 3, 4, 5].map((index) => (
                                        <li key={index}>
                                            <Skeleton className="h-20 w-full" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
