"use client";

import { DotSeparator } from "@/components/dot-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useWorkspaceId } from "@/features/workspace/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";
import { ArrowLeft, Loader, MoreHorizontal, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { useDeleteMember } from "../api/use-delete-member";
import { useGetMembers } from "../api/use-get-members";
import { useUpdateMember } from "../api/use-update-member";
import { MemberRole } from "../types";
import { MemberAvatar } from "./member-avatar";

export const MembersList = () => {
    const workspaceId = useWorkspaceId();
    const { data, isPending } = useGetMembers(workspaceId);
    const updateMember = useUpdateMember();
    const deleteMember = useDeleteMember();

    const { ConfirmDialog, confirm } = useConfirm({
        title: "Remove Member",
        message: "This member will be removed from the workspace.",
    });

    if (isPending) {
        return <p>Loading...</p>;
    }

    const isLoading = updateMember.isPending || deleteMember.isPending;

    const onUpdate = (memberId: string, role: MemberRole) => {
        updateMember.mutate({
            param: { memberId },
            json: { role },
        });
    };

    const onDelete = async (memberId: string) => {
        const ok = await confirm();
        if (!ok) return;
        deleteMember.mutate({ param: { memberId } });
    };

    return (
        <Card className="size-full border-none shadow-none">
            <ConfirmDialog />
            <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
                <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="border-none"
                >
                    <Link href={`/workspaces/${workspaceId}`}>
                        <ArrowLeft />
                        Back
                    </Link>
                </Button>

                <CardTitle className="text-xl font-bold">
                    Members List
                </CardTitle>
            </CardHeader>

            <div className="px-7">
                <DotSeparator />
            </div>

            <CardContent className="p-7">
                {data?.documents.map((member, index) => (
                    <Fragment key={member.$id}>
                        {index > 0 && (
                            <Separator className="my-2.5 bg-neutral-300" />
                        )}
                        <div className="flex items-center gap-2">
                            <MemberAvatar
                                name={member.name}
                                className="size-10"
                                fallbackClassName="text-lg"
                            />

                            <div className="flex flex-col">
                                <div className="flex items-center gap-x-1">
                                    <p className="text-sm font-medium">
                                        {member.name}
                                    </p>
                                    {member.role === MemberRole.ADMIN && (
                                        <ShieldAlert className="size-4 text-amber-700" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {member.email}
                                </p>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        className="ml-auto"
                                        variant="secondary"
                                        size="icon"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader className="animate-spin text-muted-foreground" />
                                        ) : (
                                            <MoreHorizontal className="text-muted-foreground" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="bottom" align="end">
                                    <DropdownMenuItem
                                        onClick={() =>
                                            onUpdate(
                                                member.$id,
                                                MemberRole.ADMIN,
                                            )
                                        }
                                    >
                                        Set as Admin
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            onUpdate(
                                                member.$id,
                                                MemberRole.MEMBER,
                                            )
                                        }
                                    >
                                        Set as Member
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="text-amber-700"
                                        onClick={() => onDelete(member.$id)}
                                    >
                                        Remove {member.name}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </Fragment>
                ))}
            </CardContent>
        </Card>
    );
};
