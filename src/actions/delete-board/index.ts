"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { getProjectIdOrThrowPermissionError } from "../helpers";
import { DeleteBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data;
  let projectId: string;
  try {
    projectId = await getProjectIdOrThrowPermissionError(id);

    await db.board.delete({
      where: {
        id,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }

  revalidatePath(`/app/project/${projectId}`);
  redirect(`/app/project/${projectId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
