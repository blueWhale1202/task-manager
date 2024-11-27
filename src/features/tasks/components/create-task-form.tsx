"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { taskSchema } from "../schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { DotSeparator } from "@/components/dot-separator";

import { DatePicker } from "@/components/date-picker";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspace/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/types";
import { useCreateTask } from "../api/use-create-task";
import { MemberOption, ProjectOption } from "../types";

type FormValues = z.infer<typeof taskSchema>;

type Props = {
    onCancel?: () => void;
    projectOptions: ProjectOption[];
    memberOptions: MemberOption[];
};

export const CreateTaskForm = ({
    onCancel,
    projectOptions,
    memberOptions,
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(taskSchema.omit({ workspaceId: true })),
        defaultValues: {
            name: "",
        },
    });

    const workspaceId = useWorkspaceId();

    const { mutate, isPending } = useCreateTask();

    const onSubmit = (values: FormValues) => {
        const finalValues = {
            ...values,
            workspaceId,
        };

        mutate(
            { json: finalValues },
            {
                onSuccess: ({ data }) => {
                    form.reset();
                    onCancel?.();
                },
            },
        );
    };

    return (
        <Card className="size-full border-none shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">
                    Create a new task
                </CardTitle>
            </CardHeader>

            <div className="px-7">
                <DotSeparator />
            </div>

            <CardContent className="p-7">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter task name"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Due Date</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            {...field}
                                            placeholder="Select due date"
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="assigneeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assignee</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select assignee" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {memberOptions.map((member) => (
                                                    <SelectItem
                                                        key={member.id}
                                                        value={member.id}
                                                    >
                                                        <div className="flex items-center gap-x-2">
                                                            <MemberAvatar
                                                                className="size-6"
                                                                name={
                                                                    member.name
                                                                }
                                                            />
                                                            <span>
                                                                {member.name}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select assignee" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem
                                                    value={TaskStatus.BACKLOG}
                                                >
                                                    Backlog
                                                </SelectItem>
                                                <SelectItem
                                                    value={
                                                        TaskStatus.IN_PROGRESS
                                                    }
                                                >
                                                    In Progress
                                                </SelectItem>
                                                <SelectItem
                                                    value={TaskStatus.IN_REVIEW}
                                                >
                                                    In Review
                                                </SelectItem>
                                                <SelectItem
                                                    value={TaskStatus.TODO}
                                                >
                                                    Todo
                                                </SelectItem>
                                                <SelectItem
                                                    value={TaskStatus.DONE}
                                                >
                                                    Done
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="projectId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select project" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {projectOptions.map(
                                                    (project) => (
                                                        <SelectItem
                                                            key={project.id}
                                                            value={project.id}
                                                        >
                                                            <div className="flex items-center gap-x-2">
                                                                <ProjectAvatar
                                                                    className="size-6"
                                                                    name={
                                                                        project.name
                                                                    }
                                                                    image={
                                                                        project.imageUrl
                                                                    }
                                                                />
                                                                <span>
                                                                    {
                                                                        project.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="!mt-7 flex items-center justify-between">
                            <Button
                                type="button"
                                size="lg"
                                variant="secondary"
                                onClick={onCancel}
                                disabled={isPending}
                                className={cn(!onCancel && "invisible")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isPending}
                            >
                                Create Task
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
