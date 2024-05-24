"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteProject } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data;
  let project;
  try {
    project = await db.project.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/app/project`);
  return { data: project };
};

export const deleteProject = createSafeAction(DeleteProject, handler);
