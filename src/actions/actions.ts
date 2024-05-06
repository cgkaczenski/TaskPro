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

export async function getAllUsersByProjectId(projectId: string) {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
    where: {
      projects: {
        some: {
          id: projectId,
        },
      },
    },
  });
  return users;
}
