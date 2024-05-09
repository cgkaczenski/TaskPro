"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { checkPermissionsByProjectId } from "../helpers";
import { UpdateBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { title, id } = data;
  let projectId;

  try {
    const board = await db.board.findUnique({
      where: {
        id,
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

  let board;

  try {
    board = await db.board.update({
      where: {
        id,
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

  revalidatePath(`/app/board/${id}`);
  return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
