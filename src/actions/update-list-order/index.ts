"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./schema";
import { InputType, ReturnType } from "./types";
import { getProjectIdOrThrowPermissionError } from "../helpers";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { items, boardId } = data;

  let lists;
  try {
    const projectId = await getProjectIdOrThrowPermissionError(boardId);
    const transaction = items.map((list) =>
      db.list.update({
        where: {
          id: list.id,
          board: {
            projectId,
          },
        },
        data: {
          order: list.order,
        },
      })
    );

    lists = await db.$transaction(transaction);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }

  revalidatePath(`/app/board/${boardId}`);
  return { data: lists };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
