"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { getProjectIdOrThrowPermissionError } from "../helpers";
import { UpdateList } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { title, id, boardId } = data;

  let list;
  try {
    const projectId = await getProjectIdOrThrowPermissionError(boardId);
    list = await db.list.update({
      where: {
        id,
        boardId,
        board: {
          projectId,
        },
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      projectId: projectId,
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.UPDATE,
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

export const updateList = createSafeAction(UpdateList, handler);
