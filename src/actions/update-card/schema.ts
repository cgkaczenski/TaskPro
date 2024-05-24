import { start } from "repl";
import { z } from "zod";

export const UpdateCard = z.object({
  boardId: z.string(),
  description: z.optional(
    z.string({
      required_error: "Description is required",
      invalid_type_error: "Description is required",
    })
  ),
  title: z.optional(
    z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title is required",
      })
      .min(3, {
        message: "Title is too short",
      })
  ),
  status: z.optional(
    z.string({
      required_error: "Status is required",
      invalid_type_error: "Status is required",
    })
  ),
  startDate: z.optional(z.date()),
  dueDate: z.optional(z.date()),
  priority: z.optional(
    z.string({
      required_error: "Priority is required",
      invalid_type_error: "Priority is required",
    })
  ),
  id: z.string(),
});
