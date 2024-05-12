"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { getProjectIdOrThrowPermissionError } from "../helpers";
import { CreateCard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { title, boardId, listId } = data;

  let card;
  try {
    await getProjectIdOrThrowPermissionError(boardId);
    const list = await db.list.findUnique({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return {
        error: "List not found",
      };
    }

    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }

  revalidatePath(`/app/board/${boardId}`);
  return { data: card };
};

export const createCard = createSafeAction(CreateCard, handler);
