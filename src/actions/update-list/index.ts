"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { checkPermissionsByProjectId } from "../helpers";
import { UpdateList } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { title, id, boardId } = data;

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
      error: "Failed to update.",
    };
  }

  const permissionResult = await checkPermissionsByProjectId(projectId);
  if ("error" in permissionResult) {
    return { error: permissionResult.error };
  }

  let list;

  try {
    list = await db.list.update({
      where: {
        id,
        boardId,
      },
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }

  revalidatePath(`/app/board/${boardId}`);
  return { data: list };
};

export const updateList = createSafeAction(UpdateList, handler);
