"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { checkPermissionsByProjectId } from "../helpers";
import { InputType, ReturnType } from "./types";
import { CreateBoard } from "./schema";

const handler = async (
  data: InputType,
  projectId: string
): Promise<ReturnType> => {
  const permissionResult = await checkPermissionsByProjectId(projectId);
  if ("error" in permissionResult) {
    return { error: permissionResult.error };
  }

  const { title } = data;

  let board;
  try {
    board = await db.board.create({
      data: {
        title,
        projectId,
      },
    });

    await createAuditLog({
      projectId: projectId,
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/app/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
