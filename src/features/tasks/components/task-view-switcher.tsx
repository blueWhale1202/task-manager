"use client";

import { DotSeparator } from "@/components/dot-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

export const TaskViewSwitcher = () => {
    const { open } = useCreateTaskModal();

    return (
        <Tabs className="w-full flex-1 rounded-lg border" defaultValue="table">
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
                Data Filter
                <DotSeparator className="my-4" />
                <TabsContent value="table">Table</TabsContent>
                <TabsContent value="kanban">Kanban</TabsContent>
                <TabsContent value="calendar">Calendar</TabsContent>
            </div>
        </Tabs>
    );
};
