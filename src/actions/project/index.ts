"use server";

import { Project } from "@prisma/client";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllProjects() {
  noStore();
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const projects = await db.project.findMany({
    where: {
      members: {
        some: {
          id: user.id,
        },
      },
    },
  });

  if (!projects) {
    return null;
  }
  return projects as Project[];
}

export async function getProjectByBoardId(boardId: string) {
  noStore();
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const project = await db.project.findFirst({
    where: {
      boards: {
        some: {
          id: boardId,
        },
      },
      members: {
        some: {
          id: user.id,
        },
      },
    },
  });

  if (!project) {
    return null;
  }
  return project as Project;
}
