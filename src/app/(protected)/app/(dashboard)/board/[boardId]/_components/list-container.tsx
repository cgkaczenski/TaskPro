"use client";

import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { useAction } from "@/hooks/use-action";
import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "list") {
      handleListDrag(source.index, destination.index);
    } else if (type === "card") {
      handleCardDrag(source, destination);
    }
  };

  const handleListDrag = (sourceIndex: number, destinationIndex: number) => {
    const items = reorder(orderedData, sourceIndex, destinationIndex).map(
      (item, index) => ({ ...item, order: index })
    );

    setOrderedData(items);
    executeUpdateListOrder({ items, boardId });
  };

  const handleCardDrag = (source: any, destination: any) => {
    let newOrderedData = [...orderedData];
    const sourceList = newOrderedData.find(
      (list) => list.id === source.droppableId
    );
    const destList = newOrderedData.find(
      (list) => list.id === destination.droppableId
    );

    if (!sourceList || !destList) {
      return;
    }

    sourceList.cards = sourceList.cards || [];
    destList.cards = destList.cards || [];

    if (source.droppableId === destination.droppableId) {
      moveCardWithinList(sourceList, source.index, destination.index);
    } else {
      moveCardBetweenLists(
        sourceList,
        destList,
        source.index,
        destination.index
      );
    }

    setOrderedData(newOrderedData);
  };

  const moveCardWithinList = (
    list: ListWithCards,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const reorderedCards = reorder(list.cards, sourceIndex, destinationIndex);
    reorderedCards.forEach((card, idx) => {
      card.order = idx;
    });

    list.cards = reorderedCards;
    executeUpdateCardOrder({ boardId: boardId, items: reorderedCards });
  };

  const moveCardBetweenLists = (
    sourceList: ListWithCards,
    destList: ListWithCards,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const [movedCard] = sourceList.cards.splice(sourceIndex, 1);
    movedCard.listId = destList.id;
    destList.cards.splice(destinationIndex, 0, movedCard);

    updateCardOrderLocally(sourceList.cards);
    updateCardOrderLocally(destList.cards);

    executeUpdateCardOrder({ boardId: boardId, items: destList.cards });
  };

  const updateCardOrderLocally = (cards: any[]) => {
    cards.forEach((card, idx) => {
      card.order = idx;
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="vertical">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-col space-y-3"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />

            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
