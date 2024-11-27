import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const ErrorUI = () => {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-y-2">
            <TriangleAlert className="size-6 text-destructive" />
            <p className="text-sm text-destructive">Something went wrong.</p>
            <Button variant="secondary" size="sm" asChild>
                <Link href="/">Go back to home</Link>
            </Button>
        </div>
    );
};
