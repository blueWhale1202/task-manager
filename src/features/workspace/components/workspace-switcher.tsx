"use client";

import { useRouter } from "next/navigation";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Loader } from "lucide-react";
import { RiAddCircleFill } from "react-icons/ri";

import { Workspace } from "@/types";
import { WorkspaceAvatar } from "./workspace-avatar";

import { useGetWorkspaces } from "../api/use-get-workspaces";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";
import { useWorkspaceId } from "../hooks/use-workspace-id";

export const WorkspaceSwitcher = () => {
    const { data: workspaces, isLoading } = useGetWorkspaces();
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
                    <WorkspaceContent
                        isLoading={isLoading}
                        workspaces={workspaces.documents}
                    />
                </SelectContent>
            </Select>
        </div>
    );
};

type Props = {
    isLoading: boolean;
    workspaces?: Workspace[];
};
export const WorkspaceContent = ({ isLoading, workspaces }: Props) => {
    if (isLoading) {
        return (
            <SelectItem disabled value="none">
                <div className="flex text-neutral-700">
                    <Loader className="mr-2 size-5 animate-spin" />
                </div>
            </SelectItem>
        );
    }

    if (!workspaces || !workspaces.length) {
        return (
            <SelectItem disabled value="none">
                <div className="text-neutral-700">No workspaces</div>
            </SelectItem>
        );
    }

    return workspaces.map((workspace) => (
        <SelectItem key={workspace.$id} value={workspace.$id}>
            <div className="flex items-center justify-start gap-3 font-medium">
                <WorkspaceAvatar
                    name={workspace.name}
                    image={workspace.imageUrl}
                />
                <span className="truncate">{workspace.name}</span>
            </div>
        </SelectItem>
    ));
};
