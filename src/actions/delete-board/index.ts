"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { checkPermissions } from "../helper";
import { DeleteBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (
  data: InputType,
  projectId: string
): Promise<ReturnType> => {
  const permissionResult = await checkPermissions(projectId);
  if ("error" in permissionResult) {
    return { error: permissionResult.error };
  }

  const { id } = data;
  let board;

  try {
    board = await db.board.delete({
      where: {
        id,
        projectId,
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/app/project/${projectId}`);
  redirect(`/app/project/${projectId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
