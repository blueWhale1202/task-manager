"use client";

import { DotSeparator } from "@/components/dot-separator";
import { PageError } from "@/components/page-error";
import { Skeleton } from "@/components/ui/skeleton";

import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { TaskDescription } from "@/features/tasks/components/task-description";
import { TaskOverview } from "@/features/tasks/components/task-overview";

import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";

export default function TaskPage() {
    const taskId = useTaskId();
    const { data, isPending } = useGetTask(taskId);

    if (isPending) {
        return <TaskPageLoading />;
    }

    if (!data) {
        return <PageError message="Task not found" />;
    }

    return (
        <div className="flex flex-col">
            <TaskBreadcrumbs project={data.project} task={data} />
            <DotSeparator className="my-6" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <TaskOverview task={data} />
                <TaskDescription task={data} />
            </div>
        </div>
    );
}

export const TaskPageLoading = () => {
    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <Skeleton className="size-6 lg:size-8" />
                    <p className="text-sm font-semibold lg:text-lg">Task</p>
                </div>
                <Skeleton className="h-8 w-20" />
            </div>
            <DotSeparator className="my-6" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="col-span-1 flex flex-col gap-y-4">
                    <div className="rounded-lg bg-muted p-4">
                        <p className="text-lg font-semibold">Overview</p>
                        <Skeleton className="mt-2 h-40 w-full rounded-md" />
                    </div>
                </div>
                <div className="rounded-lg bg-muted p-4">
                    <p className="text-lg font-semibold">Description</p>
                    <Skeleton className="mt-2 h-40 w-full rounded-md" />
                </div>
            </div>
        </div>
    );
};
