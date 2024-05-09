"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { checkPermissions } from "../helper";
import { CreateList } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (
  data: InputType,
  projectId: string
): Promise<ReturnType> => {
  const permissionResult = await checkPermissions(projectId);
  if ("error" in permissionResult) {
    return { error: permissionResult.error };
  }

  const { title, boardId } = data;
  let list;

  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        projectId,
      },
    });

    if (!board) {
      return {
        error: "Board not found",
      };
    }

    const lastList = await db.list.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        title,
        boardId,
        order: newOrder,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/app/board/${boardId}`);
  return { data: list };
};

export const createList = createSafeAction(CreateList, handler);
