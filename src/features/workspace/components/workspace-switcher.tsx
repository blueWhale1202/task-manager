"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { RiAddCircleFill } from "react-icons/ri";

import { useRouter } from "next/navigation";
import { useGetWorkspaces } from "../api/use-get-workspaces";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { WorkspaceAvatar } from "./workspace-avatar";

export const WorkspaceSwitcher = () => {
    const { data: workspaces } = useGetWorkspaces();
    const { open } = useCreateWorkspaceModal();

    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const onSelect = (workspaceId: string) => {
        router.push(`/workspaces/${workspaceId}`);
    };

    if (!workspaces) {
        return null;
    }

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase text-neutral-500">
                    Workspaces
                </p>
                <RiAddCircleFill
                    onClick={open}
                    className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
                />
            </div>

            <Select onValueChange={onSelect} value={workspaceId}>
                <SelectTrigger className="w-full bg-neutral-200 p-1 font-medium focus:ring-transparent">
                    <SelectValue placeholder="No workspace selected" />
                </SelectTrigger>
                <SelectContent>
                    {workspaces?.documents.map((workspace) => (
                        <SelectItem key={workspace.$id} value={workspace.$id}>
                            <div className="flex items-center justify-start gap-3 font-medium">
                                <WorkspaceAvatar
                                    name={workspace.name}
                                    image={workspace.imageUrl}
                                />
                                <span className="truncate">
                                    {workspace.name}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
