"use client";

import { useQueryState } from "nuqs";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Loader, Plus } from "lucide-react";
import { UpdatePayload } from "../types";

import { DotSeparator } from "@/components/dot-separator";
import { DataTable } from "@/features/tasks/components/data-table";

import { columns } from "./columns";
import { DataCalendar } from "./data-calendar";
import { DataFilters } from "./data-filters";
import { DataKanban } from "./data-kanban";

import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useWorkspaceId } from "@/features/workspace/hooks/use-workspace-id";

import { useBulkUpdateTask } from "../api/use-bulk-update-task";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilters } from "../hooks/use-task-filters";

type Props = {
    hideProjectFilter?: boolean;
};

export const TaskViewSwitcher = ({ hideProjectFilter }: Props) => {
    const workspaceId = useWorkspaceId();
    const paramProjectId = useProjectId();

    const [{ assigneeId, projectId, status, dueDate, search }, setFilters] =
        useTaskFilters();

    const { data: tasks, isPending } = useGetTasks({
        workspaceId,
        projectId: paramProjectId || projectId,
        assigneeId,
        status,
        dueDate,
        search,
    });

    const { mutate: bulkUpdateTask } = useBulkUpdateTask();

    const { open } = useCreateTaskModal();

    const [view, setView] = useQueryState("task-view", {
        defaultValue: "table",
    });

    const onKanbanChange = useCallback(
        (tasks: UpdatePayload[]) => {
            console.log("🚀 ~ TaskViewSwitcher ~ tasks:", tasks);
            bulkUpdateTask({
                json: { tasks },
            });
        },
        [bulkUpdateTask],
    );

    return (
        <Tabs
            className="w-full flex-1 rounded-lg border"
            defaultValue={view}
            onValueChange={setView}
        >
            <div className="flex h-full flex-col overflow-auto p-4">
                <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger
                            className="h-8 w-full lg:w-auto"
                            value="table"
                        >
                            Table
                        </TabsTrigger>
                        <TabsTrigger
                            className="h-8 w-full lg:w-auto"
                            value="kanban"
                        >
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger
                            className="h-8 w-full lg:w-auto"
                            value="calendar"
                        >
                            Calendar
                        </TabsTrigger>
                    </TabsList>

                    <Button
                        size="sm"
                        className="w-full lg:w-auto"
                        onClick={open}
                    >
                        <Plus />
                        New
                    </Button>
                </div>

                <DotSeparator className="my-4" />

                <DataFilters hideProjectFilter={hideProjectFilter} />

                <DotSeparator className="my-4" />

                {isPending ? (
                    <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
                        <Loader className="size-5 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <TabsContent value="table" className="mt-0">
                            <DataTable
                                columns={columns}
                                data={tasks?.documents || []}
                            />
                        </TabsContent>
                        <TabsContent value="kanban" className="mt-0">
                            <DataKanban
                                data={tasks?.documents || []}
                                onChange={onKanbanChange}
                            />
                        </TabsContent>
                        <TabsContent
                            value="calendar"
                            className="mt-0 h-full pb-4"
                        >
                            <DataCalendar data={tasks?.documents || []} />
                        </TabsContent>
                    </>
                )}
            </div>
        </Tabs>
    );
};
