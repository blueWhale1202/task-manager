"use client";

import { DataTable } from "@/components/data-table";
import { DotSeparator } from "@/components/dot-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspace/hooks/use-workspace-id";
import { TaskExtend } from "@/types";
import { Loader, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback } from "react";
import { useBulkUpdateTask } from "../api/use-bulk-update-task";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilters } from "../hooks/use-task-filters";
import { UpdatePayload } from "../types";
import { columns } from "./columns";
import { DataFilters } from "./data-filters";
import { DataKanban } from "./data-kanban";

export const TaskViewSwitcher = () => {
    const workspaceId = useWorkspaceId();
    const [{ assigneeId, projectId, status, dueDate, search }, setFilters] =
        useTaskFilters();

    const { data: tasks, isPending } = useGetTasks({
        workspaceId,
        projectId,
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

                <DataFilters />

                <DotSeparator className="my-4" />

                {isPending ? (
                    <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
                        <Loader className="size-5 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <TabsContent value="table">
                            <DataTable
                                columns={columns}
                                data={tasks?.documents || []}
                            />
                        </TabsContent>
                        <TabsContent value="kanban">
                            <DataKanban
                                data={(tasks?.documents as TaskExtend[]) || []}
                                onChange={onKanbanChange}
                            />
                        </TabsContent>
                        <TabsContent value="calendar">Calendar</TabsContent>
                    </>
                )}
            </div>
        </Tabs>
    );
};
