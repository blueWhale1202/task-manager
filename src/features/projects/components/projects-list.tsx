"use client";

import { useWorkspaceId } from "@/features/workspace/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import { useGetProjects } from "../api/use-get-projects";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";
import { useProjectId } from "../hooks/use-project-id";
import { ProjectAvatar } from "./project-avatar";

export const ProjectsList = () => {
    const workspaceId = useWorkspaceId();
    const projectId = useProjectId();

    const { open } = useCreateProjectModal();

    const { data, isPending } = useGetProjects(workspaceId);

    const pathname = usePathname();

    if (isPending) {
        return <p>Loading...</p>;
    }

    if (!data) {
        return <p>No projects found</p>;
    }

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase text-neutral-500">
                    Projects
                </p>
                <RiAddCircleFill
                    onClick={open}
                    className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
                />
            </div>

            {data.documents.map((project) => {
                const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
                const isActive = pathname === href;

                return (
                    <Link href={href} key={project.$id}>
                        <div
                            className={cn(
                                "flex cursor-pointer items-center gap-2.5 rounded-md p-2.5 text-neutral-500 transition hover:opacity-75",
                                isActive &&
                                    "bg-white text-primary shadow-sm hover:opacity-100",
                            )}
                        >
                            <ProjectAvatar
                                image={project.imageUrl}
                                name={project.name}
                                fallbackClassName="text-sm"
                            />
                            <span className="truncate">{project.name}</span>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};
