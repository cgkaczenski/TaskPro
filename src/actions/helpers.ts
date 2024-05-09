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
