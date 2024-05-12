"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { getProjectIdOrThrowPermissionError } from "../helpers";
import { DeleteList } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, boardId } = data;

  let list;
  try {
    const projectId = await getProjectIdOrThrowPermissionError(boardId);
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          projectId,
        },
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }

  revalidatePath(`/app/board/${boardId}`);
  return { data: list };
};

export const deleteList = createSafeAction(DeleteList, handler);
