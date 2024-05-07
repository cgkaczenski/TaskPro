"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllUsersByProjectId(projectId: string) {
  noStore();
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      projectRoles: {
        where: {
          projectId: projectId,
        },
        select: {
          role: true,
        },
      },
    },
    where: {
      projects: {
        some: {
          id: projectId,
        },
      },
    },
  });

  return users.map((user) => ({
    ...user,
    role: user.projectRoles[0]?.role,
  }));
}
