"use client";

import Link from "next/link";

import { PageError } from "@/components/page-error";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { DotSeparator } from "@/components/dot-separator";
import { EditWorkspaceForm } from "@/features/workspace/components/edit-workspace-form";

import { useGetWorkspace } from "@/features/workspace/api/use-get-workspace";
import { useWorkspaceId } from "@/features/workspace/hooks/use-workspace-id";

export default function WorkspaceSettingPage() {
    const workspaceId = useWorkspaceId();

    const { data: initialData, isLoading } = useGetWorkspace(workspaceId);

    if (isLoading) {
        return <SettingLoading title="Workspace settings" />;
    }

    if (!initialData) {
        return <PageError message="Workspace not found" />;
    }

    return (
        <div className="size-full lg:max-w-xl">
            <EditWorkspaceForm initialData={initialData} />
        </div>
    );
}

type Props = {
    title: string;
};
export const SettingLoading = ({ title }: Props) => {
    const workspaceId = useWorkspaceId();
    return (
        <div className="size-full lg:max-w-xl">
            <Card className="size-full border-none shadow-none">
                <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
                    <Button
                        variant="link"
                        size="sm"
                        className="border-none"
                        asChild
                    >
                        <Link href={`/workspaces/${workspaceId}`}>
                            <ArrowLeft />
                            Back
                        </Link>
                    </Button>

                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                </CardHeader>

                <div className="px-7">
                    <DotSeparator />
                </div>

                <CardContent className="space-y-4 p-7">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="ml-auto h-10 w-32" />
                </CardContent>
            </Card>
        </div>
    );
};
