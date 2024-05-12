"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { getProjectIdOrThrowPermissionError } from "../helpers";
import { UpdateBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { title, id } = data;

  let board;
  try {
    const projectId = await getProjectIdOrThrowPermissionError(id);
    board = await db.board.update({
      where: {
        id,
        projectId,
      },
      data: {
        title,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }

  revalidatePath(`/app/board/${id}`);
  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
