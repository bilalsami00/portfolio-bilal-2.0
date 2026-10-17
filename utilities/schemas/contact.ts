import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max, `Keep this under ${max} characters`).default("");

export const contactMessageSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your name")
    .max(120, "Keep your name under 120 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email")
    .max(254, "Email is too long")
    .email("Please enter a valid email"),
  phone: optionalText(40),
  company: optionalText(120),
  subject: z
    .string()
    .trim()
    .min(1, "Please add a subject")
    .max(200, "Keep the subject under 200 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(5000, "Keep the message under 5000 characters"),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

/** Hidden field name; real visitors never fill it. */
export const CONTACT_HONEYPOT_FIELD = "website";

/** Maps a failed Zod parse onto Formik's `{ field: message }` error shape. */
export const toFieldErrors = <T extends Record<string, unknown>>(
  error: z.ZodError
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};
  error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof T | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  });
  return errors;
};
