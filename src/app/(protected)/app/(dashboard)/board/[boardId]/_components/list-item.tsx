"use client";

import { ListWithCards } from "@/types";
import { ListHeader } from "./list-header";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";
import { Gantt } from "./gantt";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("list");

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const isDraggable = selectedTab === "list";

  const renderContent = (provided: any) => (
    <li
      {...provided.draggableProps}
      ref={provided.innerRef}
      className="shrink-0 h-full w-full select-none"
    >
      <div
        {...provided.dragHandleProps}
        className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
      >
        <ListHeader onAddCard={enableEditing} data={data} />
        <Tabs defaultValue="list" onValueChange={setSelectedTab}>
          <TabsList className="pt-2 px-2 text-sm font-semibold">
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="gantt">Gantt</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.cards.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {data.cards.length > 0 && (
                    <div className="flex items-center space-x-4 border-b border-gray-200 py-2 px-3 text-sm bg-white cursor-default">
                      <div className="truncate flex-1">Task Name</div>
                      <div className="truncate flex-1">People</div>
                      <div className="truncate flex-1">Status</div>
                      <div className="truncate flex-1">Priority</div>
                      <div className="truncate flex-1">Start Date</div>
                      <div className="truncate flex-1">Due Date</div>
                    </div>
                  )}
                  {data.cards.map((card, index) => (
                    <CardItem index={index} key={card.id} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={data.id}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </TabsContent>
          <TabsContent value="gantt">
            <Gantt data={data.cards} />
          </TabsContent>
        </Tabs>
      </div>
    </li>
  );

  return (
    <Draggable
      draggableId={data.id}
      index={index}
      isDragDisabled={!isDraggable}
    >
      {renderContent}
    </Draggable>
  );
};
