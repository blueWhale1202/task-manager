import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { getProject } from "@/features/projects/queries/get-project";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { Pencil } from "lucide-react";
import Link from "next/link";

type Props = {
    params: {
        workspaceId: string;
        projectId: string;
    };
};
export default async function ProjectPage({ params }: Props) {
    const { workspaceId, projectId } = params;

    const project = await getProject(projectId);

    if (!project) {
        throw new Error("Project not found");
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

            <TaskViewSwitcher />
        </div>
    );
}
