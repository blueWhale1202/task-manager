import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspace/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Project, TaskExtend, TaskStatus } from "@/types";
import { useRouter } from "next/navigation";
import { STATUS_COLOR_MAP } from "../constants";

type Props = {
    id: string;
    title: string;
    assignee?: TaskExtend["assignee"];
    project?: Project;
    status: TaskStatus;
};

export const EventCard = ({ id, title, assignee, project, status }: Props) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/workspaces/${workspaceId}/tasks/${id}`);
    };

    return (
        <div className="mb-1 px-2">
            <div
                className={cn(
                    "flex cursor-pointer flex-col gap-y-1.5 rounded-md border border-l-4 bg-white p-1.5 text-xs text-primary transition hover:opacity-75",
                    STATUS_COLOR_MAP[status],
                )}
                onClick={onClick}
            >
                <p>{title}</p>
                <div className="flex items-center gap-x-1">
                    <MemberAvatar name={assignee?.name} />

                    <div className="size-1 rounded-full bg-neutral-300" />

                    <ProjectAvatar
                        name={project?.name}
                        image={project?.imageUrl}
                    />
                </div>
            </div>
        </div>
    );
};
