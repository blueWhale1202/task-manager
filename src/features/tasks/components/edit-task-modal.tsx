"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { EditTaskWrapper } from "./edit-task-wrapper";

import { useEditTaskModal } from "../hooks/use-edit-task-modal";

export const EditTaskModal = () => {
    const { taskId, close } = useEditTaskModal();
    return (
        <ResponsiveModal open={!!taskId} onOpenChange={close}>
            {taskId && <EditTaskWrapper id={taskId} onCancel={close} />}
        </ResponsiveModal>
    );
};
