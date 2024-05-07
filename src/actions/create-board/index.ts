"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { currentUser } from "@/lib/auth";
import { InputType, ReturnType } from "./types";
import { CreateBoard } from "./schema";

const handler = async (
  data: InputType,
  projectId: string
): Promise<ReturnType> => {
  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  if (!projectId) {
    return {
      error: "Project Id required.",
    };
  }

  try {
    const project = await db.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        members: {
          select: {
            id: true,
            role: true,
            projectRoles: {
              where: {
                projectId: projectId,
              },
              select: {
                role: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return { error: "Project not found." };
    }

    const isUserAuthorized = project.members.some(
      (member) =>
        member.id === user.id &&
        (member.role === "ADMIN" ||
          member.projectRoles.some(
            (role) => role.role === "ADMIN" || role.role === "USER"
          ))
    );

    if (!isUserAuthorized) {
      return { error: "Unauthorized" };
    }
  } catch (error) {
    return { error: "Error fetching board." };
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
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/app/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
