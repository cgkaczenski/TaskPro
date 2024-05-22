"use client";

import { getCardById } from "@/actions/get-card";
import { CardWithList } from "@/types";
import { useCardModal } from "@/hooks/use-card-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Header } from "./header";
import { Details } from "./details";
import { Actions } from "./actions";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);
  const [cardData, setCardData] = useState<CardWithList | null>(null);

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
  }, [id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? <Details.Skeleton /> : <Details data={cardData} />}
            </div>
          </div>
          {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
