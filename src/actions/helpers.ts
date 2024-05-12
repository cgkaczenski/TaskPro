"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

type PermissionErrorResult = { status: "authorized" } | { error: string };

export const checkPermissionsByProjectId = async (
  projectId: string
): Promise<PermissionErrorResult> => {
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
    return { error: "Error checking permissions." };
  }

  return { status: "authorized" };
};

const getProjectIdByBoardId = async (
  boardId: string
): Promise<string | { error: string }> => {
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

    return board.projectId;
  } catch (error) {
    return {
      error: "Failed to get project id by board id",
    };
  }
};

const handleError = <T>(result: T | { error: string } | null): T => {
  if (result === null) {
    throw new Error("Result is null");
  }
  if (typeof result === "object" && "error" in result) {
    throw new Error(result.error);
  }
  return result;
};

export const getProjectIdOrThrowPermissionError = async (boardId: string) => {
  const projectIdResult = await getProjectIdByBoardId(boardId);
  const projectId = handleError(projectIdResult);
  await checkPermissionsByProjectId(projectId).then(handleError);
  return projectId;
};
