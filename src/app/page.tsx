import { redirect } from "next/navigation";

import { UserButton } from "@/components/user-button";
import { getCurrent } from "@/features/auth/actions";

export default async function AppPage() {
    const user = await getCurrent();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <div>
            <UserButton />
        </div>
    );
}
