"use client";

import { Analytics } from "@/components/analytics";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { Pencil } from "lucide-react";
import Link from "next/link";

export default function ProjectPage() {
    const projectId = useProjectId();

    const { data: project, isLoading } = useGetProject(projectId);
    const analytics = useGetProjectAnalytics(projectId);

    if (isLoading || analytics.isLoading) {
        return <PageLoader />;
    }

    if (!project) {
        return <PageError message="Project not found" />;
    }

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <ProjectAvatar
                        name={project.name}
                        image={project.imageUrl}
                        className="size-8"
                    />
                    <p className="text-lg font-semibold">{project.name}</p>
                </div>

                <div>
                    <Button variant="secondary" size="sm" asChild>
                        <Link
                            href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
                        >
                            <Pencil />
                            Edit project
                        </Link>
                    </Button>
                </div>
            </div>

            {analytics.data && <Analytics data={analytics.data} />}
            <TaskViewSwitcher hideProjectFilter />
        </div>
    );
}
