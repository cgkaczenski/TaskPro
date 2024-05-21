"use server";

import { CardWithList } from "@/types";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { unstable_noStore as noStore } from "next/cache";
import { getProjectIdOrThrowPermissionError } from "../helpers";

export async function getCardById(cardId: string) {
  noStore();
  const user = await currentUser();

  if (!user) {
    return null;
  }

  let card;
  try {
    card = await db.card.findUnique({
      where: {
        id: cardId,
      },
      include: {
        list: {
          select: {
            title: true,
            boardId: true,
          },
        },
      },
    });

    if (!card) {
      return null;
    }

    const boardId = card.list.boardId;
    await getProjectIdOrThrowPermissionError(boardId);
  } catch (error) {
    return {
      error: "Failed to get card",
    };
  }

  return card as CardWithList;
}
