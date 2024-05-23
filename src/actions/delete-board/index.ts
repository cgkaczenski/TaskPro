"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { getProjectIdOrThrowPermissionError } from "../helpers";
import { DeleteBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data;
  let projectId;
  let board;
  try {
    projectId = await getProjectIdOrThrowPermissionError(id);

    board = await db.board.delete({
      where: {
        id,
      },
    });

    await createAuditLog({
      projectId: projectId,
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }

  revalidatePath(`/app/project/${projectId}`);
  redirect(`/app/project/${projectId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
