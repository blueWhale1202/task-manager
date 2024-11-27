import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries/get-project";
import { redirect } from "next/navigation";

type Props = {
    params: {
        workspaceId: string;
        projectId: string;
    };
};

export default async function ProjectSettingsPage({ params }: Props) {
    const { projectId } = params;

    const project = await getProject(projectId);

    if (!project) {
        redirect(`/`);
    }
    return (
        <div className="w-full lg:max-w-xl">
            <EditProjectForm initialData={project} />
        </div>
    );
}
