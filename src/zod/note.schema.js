import { z } from "zod";

const titleSchema = z
  .string()
  .trim()
  .min(1, { message: "Title is required" })
  .max(200, { message: "Title must be at most 200 characters" });

const contentSchema = z
  .string()
  .trim()
  .min(1, { message: "Content is required" });

const tagsSchema = z
  .array(
    z.string().trim().min(1, { message: "Each tag must be a non-empty string" })
  )
  .optional();


export const createNoteSchema = z.object({
  title: titleSchema,
  content: contentSchema,
  tags: tagsSchema,
});


export const updateNoteSchema = z
  .object({
    title: titleSchema.optional(),
    content: contentSchema.optional(),
    tags: tagsSchema,
  })
  .refine(
    (data) => data.title !== undefined || data.content !== undefined || data.tags !== undefined,
    {
      message: "At least one of title, content, or tags must be provided",
    }
  );
