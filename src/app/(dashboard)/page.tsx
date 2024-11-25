import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";

export default async function AppPage() {
    const user = await getCurrent();

    if (!user) {
        redirect("/sign-in");
    }

    return <div>This is the dashboard</div>;
}
