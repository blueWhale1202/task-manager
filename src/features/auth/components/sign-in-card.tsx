"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignInFormValues, signInSchema } from "../schema";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { DotSeparator } from "@/components/dot-separator";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

export const SignInCard = () => {
    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: SignInFormValues) => {
        console.log("🚀 ~ onSubmit ~ values:", values);
    };

    return (
        <Card className="h-full w-full border-none shadow-none md:w-[487px]">
            <CardHeader className="p-7 text-center">
                <CardTitle className="text-2xl">Welcome back!</CardTitle>
            </CardHeader>
            <div className="mb-2 px-7">
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter email address"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter password"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={false}
                            className="w-full"
                        >
                            Login In
                        </Button>
                    </form>
                </Form>
            </CardContent>

            <div className="px-7">
                <DotSeparator />
            </div>

            <CardContent className="flex flex-col gap-y-4 p-7">
                <Button variant="secondary" size="lg" className="w-full">
                    <FcGoogle className="mr-2 !size-5" />
                    Continue with Google
                </Button>
                <Button variant="secondary" size="lg" className="w-full">
                    <FaGithub className="mr-2 !size-5" /> Continue with Github
                </Button>
            </CardContent>
            <div className="px-7">
                <DotSeparator />
            </div>

            <CardFooter className="p-7 text-center">
                <p>
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="text-blue-700">
                        Sign Up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
};
