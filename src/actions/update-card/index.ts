"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";
import { InputType, ReturnType } from "./types";
import { getProjectIdOrThrowPermissionError } from "../helpers";
import { TaskStatus } from "@prisma/client";
import { Priority } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, boardId, ...values } = data;

  let card;
  try {
    const projectId = await getProjectIdOrThrowPermissionError(boardId);
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
        status: values.status ? (values.status as TaskStatus) : null,
        priority: values.priority ? (values.priority as Priority) : null,
        startDate: values.startDate ? new Date(values.startDate) : null,
        dueDate: values.dueDate ? new Date(values.dueDate) : null,
      },
    });

    await createAuditLog({
      projectId: projectId,
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE,
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
