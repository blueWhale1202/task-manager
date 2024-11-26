import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { getWorkspaces } from "@/features/workspace/actions";

export default async function AppPage() {
    const user = await getCurrent();

    if (!user) {
        redirect("/sign-in");
    }

    const workspaces = await getWorkspaces();
    if (workspaces.total > 0) {
        redirect(`/workspaces/${workspaces.documents[0].$id}`);
    } else {
        redirect("/workspaces/create");
    }
}
