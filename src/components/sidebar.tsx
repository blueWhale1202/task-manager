import Image from "next/image";
import Link from "next/link";

import { DotSeparator } from "./dot-separator";
import { Navigation } from "./navigation";

export const Sidebar = () => {
    return (
        <aside className="size-full bg-neutral-100 p-4">
            <Link href="/">
                <Image src="/logo.svg" alt="Logo" width={164} height={48} />
            </Link>
            <DotSeparator className="my-4" />
            <Navigation />
        </aside>
    );
};
