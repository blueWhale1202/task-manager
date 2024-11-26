import { DatePicker } from "@/components/date-picker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspace/hooks/use-workspace-id";
import { TaskStatus } from "@/types";
import { Folder, ListCheck, Loader, User2 } from "lucide-react";
import { useTaskFilters } from "../hooks/use-task-filters";

type Props = {
    hideProjectFilter?: boolean;
};

export const DataFilters = ({ hideProjectFilter }: Props) => {
    const workspaceId = useWorkspaceId();

    const projects = useGetProjects(workspaceId);
    const members = useGetMembers(workspaceId);

    const [{ assigneeId, projectId, status, dueDate, search }, setFilters] =
        useTaskFilters();

    const isLoading = projects.isPending || members.isPending;

    if (isLoading) {
        return (
            <div className="flex h-8 items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const projectOptions = projects.data?.documents?.map((project) => ({
        label: project.name,
        value: project.$id,
        imageUrl: project.imageUrl,
    }));

    const memberOptions = members.data?.documents?.map((member) => ({
        label: member.name,
        value: member.$id,
    }));

    const onValueChange = <T,>(key: string, value: T) => {
        setFilters({ [key]: value === "all" ? null : value });
    };

    return (
        <div className="flex flex-col gap-2 lg:flex-row">
            <Select
                value={status ?? undefined}
                onValueChange={(value: TaskStatus) =>
                    onValueChange("status", value)
                }
            >
                <SelectTrigger className="h-8 w-full lg:w-auto">
                    <div className="flex items-center pr-2">
                        <ListCheck className="mr-2 size-4" />
                        <SelectValue placeholder="All statuses" />
                    </div>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectSeparator />
                    <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                    <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>
                        In progress
                    </SelectItem>
                    <SelectItem value={TaskStatus.IN_REVIEW}>
                        In review
                    </SelectItem>
                    <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={assigneeId ?? undefined}
                onValueChange={(value: string) =>
                    onValueChange("assigneeId", value)
                }
            >
                <SelectTrigger className="h-8 w-full lg:w-auto">
                    <div className="flex items-center pr-2">
                        <User2 className="mr-2 size-4" />
                        <SelectValue placeholder="All assignees" />
                    </div>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All assignees</SelectItem>
                    <SelectSeparator />
                    {memberOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <div className="mr-2 flex items-center gap-x-2">
                                <MemberAvatar
                                    name={option.label}
                                    fallbackClassName="text-xs font-medium"
                                />
                                <span>{option.label}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={projectId ?? undefined}
                onValueChange={(value: string) =>
                    onValueChange("projectId", value)
                }
            >
                <SelectTrigger className="h-8 w-full lg:w-auto">
                    <div className="flex items-center pr-2">
                        <Folder className="mr-2 size-4" />
                        <SelectValue placeholder="All projects" />
                    </div>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All projects</SelectItem>
                    <SelectSeparator />
                    {projectOptions?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <div className="mr-2 flex items-center gap-x-2">
                                <ProjectAvatar
                                    name={option.label}
                                    image={option.imageUrl}
                                />
                                <span>{option.label}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <DatePicker
                placeholder="Due date"
                className="h-8 w-full lg:w-auto"
                value={dueDate ? new Date(dueDate) : undefined}
                onChange={(date) =>
                    onValueChange("dueDate", date?.toISOString())
                }
            />
        </div>
    );
};
