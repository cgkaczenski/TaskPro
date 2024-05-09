"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { checkPermissionsByProjectId } from "../helpers";
import { CreateList } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { title, boardId } = data;
  let projectId;
  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
      },
      select: {
        projectId: true,
      },
    });

    if (!board) {
      return {
        error: "Board not found",
      };
    }

    projectId = board.projectId;
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  const permissionResult = await checkPermissionsByProjectId(projectId);
  if ("error" in permissionResult) {
    return { error: permissionResult.error };
  }

  let list;

  try {
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
