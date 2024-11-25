import { cn } from "@/lib/utils";
import { LucideIcon, Settings, Users } from "lucide-react";
import Link from "next/link";
import { type IconType } from "react-icons";
import {
    GoCheckCircle,
    GoCheckCircleFill,
    GoHome,
    GoHomeFill,
} from "react-icons/go";

type Route = {
    label: string;
    href: string;
    icon: IconType | LucideIcon;
    activeIcon: IconType | LucideIcon;
};

const routes: Route[] = [
    {
        label: "Home",
        href: "/",
        icon: GoHome,
        activeIcon: GoHomeFill,
    },
    {
        label: "My Tasks",
        href: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        activeIcon: Settings,
    },
    {
        label: "Members",
        href: "/members",
        icon: Users,
        activeIcon: Users,
    },
];

export const Navigation = () => {
    return (
        <ul className="flex flex-col">
            {routes.map((route) => {
                const isActive = false;
                const Icon = isActive ? route.activeIcon : route.icon;

                return (
                    <li key={route.href} className="py-2">
                        <Link
                            href={route.href}
                            className={cn(
                                "flex items-center gap-2.5 rounded-md p-2.5 font-medium text-neutral-500 transition hover:bg-white hover:text-primary",
                                isActive &&
                                    "bg-white text-primary shadow-sm hover:opacity-100",
                            )}
                        >
                            <Icon className="size-5 text-neutral-500" />
                            {route.label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};
