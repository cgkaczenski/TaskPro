"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";
import { InputType, ReturnType } from "./types";
import { getProjectIdOrThrowPermissionError } from "../helpers";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, boardId, ...values } = data;

  let card;
  try {
    await getProjectIdOrThrowPermissionError(boardId);
    card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            id: boardId,
          },
        },
      },
      data: {
        ...values,
      },
    });
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }

  revalidatePath(`/app/board/${boardId}`);
  return { data: card };
};

export const updateCard = createSafeAction(UpdateCard, handler);
