import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { db } from "@/lib/db";
import { currentUser } from "./auth";

interface Props {
  projectId: string;
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
}

export const createAuditLog = async (props: Props) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      throw new Error("User not found!");
    }

    const { projectId, entityId, entityType, entityTitle, action } = props;

    await db.auditLog.create({
      data: {
        projectId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user?.image ? user.image : "",
        userName: user?.name ? user.name : "",
      },
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
};
