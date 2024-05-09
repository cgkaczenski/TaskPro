"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { checkPermissionsByProjectId } from "../helpers";
import { CopyList } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, boardId } = data;

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
      error: "Failed to copy list.",
    };
  }

  const permissionResult = await checkPermissionsByProjectId(projectId);
  if ("error" in permissionResult) {
    return { error: permissionResult.error };
  }

  let list;

  try {
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
      },
      include: {
        cards: true,
      },
    });

    if (!listToCopy) {
      return { error: "List not found" };
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
        cards: {
          createMany: {
            data: listToCopy.cards.map((card) => ({
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: {
        cards: true,
      },
    });
  } catch (error) {
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/app/board/${boardId}`);
  return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);
