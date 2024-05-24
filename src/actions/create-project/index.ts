"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CreateProject } from "./schema";
import { currentUser } from "@/lib/auth";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name } = data;
  const user = await currentUser();

  if (!user || (user.role !== "USER" && user.role !== "ADMIN")) {
    return { error: "Unauthorized" };
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
      },
    });
  } catch (error) {
    return { error: "Failed to create." };
  }

  revalidatePath(`/app/project/${project.id}`);
  return { data: project };
};

export const createProject = createSafeAction(CreateProject, handler);
