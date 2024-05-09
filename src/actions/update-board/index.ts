"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { checkPermissions } from "../helper";
import { UpdateBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (
  data: InputType,
  projectId: string
): Promise<ReturnType> => {
  const permissionResult = await checkPermissions(projectId);
  if ("error" in permissionResult) {
    return { error: permissionResult.error };
  }

  const { title, id } = data;
  let board;

  try {
    board = await db.board.update({
      where: {
        id,
        projectId,
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
