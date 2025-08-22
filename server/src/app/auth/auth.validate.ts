import { z } from "zod";

// Password validation: at least 8 characters, one number, one special character
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/\d/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character"
  );

const userSignupSchema = z.object({
  body: z.object({
    username: z
      .string({
        required_error: "Username field is required",
      })
      .min(3, "Username must be at least 3 characters long"),
    password: passwordSchema,
    shopNames: z
      .array(z.string().min(1, "Shop name cannot be empty"))
      .min(3, "You must enter at least 3 shop names")
      .refine((names: string[]) => new Set(names).size === names.length, {
        message: "Shop names must be unique",
      }),
  }),
});

const userSigninSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: "Username field is required",
    }),
    password: z.string({
      required_error: "Password field is required",
    }),
    rememberMe: z.boolean().optional(),
  }),
});

export const UserSchema = {
  userSignupSchema,
  userSigninSchema,
};
