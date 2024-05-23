"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyCard } from "./schema";
import { InputType, ReturnType } from "./types";
import { getProjectIdOrThrowPermissionError } from "../helpers";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, boardId } = data;

  let card;
  try {
    const projectId = await getProjectIdOrThrowPermissionError(boardId);
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            projectId,
          },
        },
      },
    });

    if (!cardToCopy) {
      return { error: "Card not found" };
    }

    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        status: cardToCopy.status,
        priority: cardToCopy.priority,
        startDate: cardToCopy.startDate,
        dueDate: cardToCopy.dueDate,
        order: newOrder,
        listId: cardToCopy.listId,
      },
    });

    await createAuditLog({
      projectId: projectId,
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/app/board/${boardId}`);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);
