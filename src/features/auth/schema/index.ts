import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Required"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
