"use server";

import { AuditLog, ENTITY_TYPE } from "@prisma/client";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { unstable_noStore as noStore } from "next/cache";

export async function getRecentAuditLogs({
  projectId,
  cardId,
}: {
  projectId: string;
  cardId: string;
}) {
  noStore();
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const auditLogs = await db.auditLog.findMany({
    where: {
      projectId,
      entityId: cardId,
      entityType: ENTITY_TYPE.CARD,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  if (!auditLogs) {
    return null;
  }

  return auditLogs as AuditLog[];
}
