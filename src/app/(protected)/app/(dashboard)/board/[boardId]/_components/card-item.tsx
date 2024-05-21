"use client";

import { AvatarGroup } from "@/components/avatar-group";
import { CardWithPeople } from "@/types";
import { Draggable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";

interface CardItemProps {
  data: CardWithPeople;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  const cardModal = useCardModal();
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(data.id)}
          className="flex items-center space-x-4 border-b border-gray-200 py-2 px-3 text-sm bg-white hover:bg-gray-50"
        >
          <div className="truncate flex-1">{data.title}</div>
          <div className="truncate flex-1">
            <AvatarGroup data={data.people} />
          </div>
          <div className="truncate flex-1">{data.status}</div>
          <div className="truncate flex-1">{data.priority}</div>
          <div className="truncate flex-1">
            {data.startDate && new Date(data.startDate).toLocaleDateString()}
          </div>
          <div className="truncate flex-1">
            {data.dueDate && new Date(data.dueDate).toLocaleDateString()}
          </div>
        </div>
      )}
    </Draggable>
  );
};
