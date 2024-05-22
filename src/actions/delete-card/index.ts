"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCard } from "./schema";
import { InputType, ReturnType } from "./types";
import { getProjectIdOrThrowPermissionError } from "../helpers";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, boardId } = data;
  let card;
  try {
    const projectId = await getProjectIdOrThrowPermissionError(boardId);
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            projectId,
          },
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/app/board/${boardId}`);
  return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
