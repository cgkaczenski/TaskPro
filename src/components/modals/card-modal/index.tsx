"use client";

import { useProject } from "@/hooks/use-project";
import { getCardById } from "@/actions/get-card";
import { CardWithList } from "@/types";
import { AuditLog } from "@prisma/client";
import { useCardModal } from "@/hooks/use-card-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Header } from "./header";
import { Details } from "./details";
import { Actions } from "./actions";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getRecentAuditLogs } from "@/actions/audit-logs";
import { Activity } from "./activity";

export const CardModal = () => {
  const { selectedProject } = useProject();
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);
  const [cardData, setCardData] = useState<CardWithList | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[] | null>(null);

  useEffect(() => {
    const getCard = async () => {
      if (id) {
        const card = await getCardById(id);
        if (card) {
          if ("error" in card) {
            setCardData(null);
            toast.error(card.error || "Failed to get card");
          } else {
            setCardData(card);
          }
        } else {
          setCardData(null);
          toast.error("Failed to get card");
        }
      } else {
        setCardData(null);
      }
    };

    getCard();
    fetchLatestAuditLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedProject?.id]);

  const fetchLatestAuditLogs = async () => {
    if (id && selectedProject?.id) {
      const logs = await getRecentAuditLogs({
        projectId: selectedProject?.id,
        cardId: id,
      });
      if (logs) {
        if ("error" in logs) {
          setAuditLogs(null);
          toast.error("Failed to get audit logs");
        } else {
          setAuditLogs(logs);
        }
      } else {
        setAuditLogs(null);
        toast.error("Failed to get audit logs");
      }
    } else {
      setAuditLogs(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? (
          <Header.Skeleton />
        ) : (
          <Header data={cardData} onUpdate={fetchLatestAuditLogs} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Details.Skeleton />
              ) : (
                <Details data={cardData} onUpdate={fetchLatestAuditLogs} />
              )}
              {!auditLogs ? (
                <Activity.Skeleton />
              ) : (
                <Activity items={auditLogs} />
              )}
            </div>
          </div>
          {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
