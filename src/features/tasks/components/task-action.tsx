import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, Pencil, Trash } from "lucide-react";

type Props = {
    id: string;
    projectId: string;
    children: React.ReactNode;
};

export const TaskActions = ({ id, projectId, children }: Props) => {
    return (
        <div className="flex justify-end">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="p-2.5 font-medium">
                        <ExternalLink className="stroke-2" />
                        Task Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-2.5 font-medium">
                        <Pencil className="stroke-2" />
                        Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-2.5 font-medium">
                        <ExternalLink className="stroke-2" />
                        Open Project
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-2.5 font-medium text-amber-700 focus:text-amber-700">
                        <Trash className="stroke-2" />
                        Delete Task
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
