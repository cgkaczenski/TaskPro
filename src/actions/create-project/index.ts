"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CreateProject } from "./schema";
import { currentUser } from "@/lib/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name } = data;
  const userSession = await currentUser();

  if (!userSession) {
    return { error: "Unauthorized" };
  }

  const user = await db.user.findUnique({
    where: {
      id: userSession?.id,
    },
  });

  if (!user || (user.role !== "USER" && user.role !== "ADMIN")) {
    return { error: "Unauthorized" };
  }

  if (!user.currentTeamId) {
    return { error: "You need to be part of a team to create a project." };
  }

  let project;
  try {
    project = await db.project.create({
      data: {
        name,
        projectLeader: {
          connect: { id: user.id },
        },
        members: {
          connect: { id: user.id },
        },
        Team: {
          connect: { id: user.currentTeamId },
        },
      },
    });
  } catch (error) {
    return { error: "Failed to create." };
  }

  revalidatePath(`/app/project/${project.id}`);
  return { data: project };
};

export const createProject = createSafeAction(CreateProject, handler);
