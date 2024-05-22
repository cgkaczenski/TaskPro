"use client";

import { toast } from "sonner";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef, ElementRef } from "react";
import { useEventListener } from "usehooks-ts";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { CardWithList } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSelect } from "@/components/form/form-select";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { FormDatePicker } from "@/components/form/form-date-picker";

interface DetailsProps {
  data: CardWithList;
}

export const Details = ({ data }: DetailsProps) => {
  const params = useParams();
  const [description, setDescription] = useState(data.description);
  const [status, setStatus] = useState(data.status);
  const [priority, setPriority] = useState(data.priority);
  const [startDate, setStartDate] = useState(data.startDate);
  const [dueDate, setDueDate] = useState(data.dueDate);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      setDescription(data.description);
      setStatus(data.status);
      setPriority(data.priority);
      setStartDate(data.startDate);
      setDueDate(data.dueDate);
      toast.success(`Card "${data.title}" updated`);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const priority = formData.get("priority") as string;
    const timeline = formData.get("timeline") as string;
    const timelineJSON = JSON.parse(timeline);
    const boardId = params.boardId as string;

    execute({
      id: data.id,
      description,
      status,
      priority,
      startDate: new Date(timelineJSON.from),
      dueDate: new Date(timelineJSON.to),
      boardId,
    });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />

      <div className="w-full">
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              id="description"
              className="w-full mt-2"
              placeholder="Add a more detailed description"
              label="Description"
              defaultValue={description || undefined}
              errors={fieldErrors}
              ref={textareaRef}
            />
            <FormSelect
              id="status"
              label="Status"
              className="w-full mt-2"
              placeholder="Add a status..."
              defaultValue={status || undefined}
              options={[
                { label: "Not started", value: "NOT_STARTED" },
                { label: "Working on it", value: "WORKING_ON_IT" },
                { label: "Done", value: "DONE" },
              ]}
              errors={fieldErrors}
            />
            <FormSelect
              id="priority"
              label="Priority"
              className="w-full mt-2"
              placeholder="Add a priority..."
              defaultValue={priority || undefined}
              options={[
                { label: "Low", value: "LOW" },
                { label: "Medium", value: "MEDIUM" },
                { label: "High", value: "HIGH" },
              ]}
              errors={fieldErrors}
            />
            <FormDatePicker
              id="timeline"
              label="Timeline"
              className="w-full mt-2"
              defaultValue={{
                from: (data.startDate as Date) || new Date(),
                to: (data.dueDate as Date) || new Date(),
              }}
              errors={fieldErrors}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className="font-semibold text-neutral-700 mb-2 m-0">
              Description
            </p>
            <div
              onClick={enableEditing}
              role="button"
              className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
            >
              {description || "Add a more detailed description..."}
            </div>
            <p className="font-semibold text-neutral-700 pt-2">Status</p>
            <div
              onClick={enableEditing}
              role="button"
              className=" bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
            >
              {status || "Add a status..."}
            </div>
            <p className="font-semibold text-neutral-700 pt-2">Priority</p>
            <div
              onClick={enableEditing}
              role="button"
              className=" bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
            >
              {priority || "Add a priority..."}
            </div>
            <p className="font-semibold text-neutral-700 pt-2">Timeline</p>
            <div
              onClick={enableEditing}
              role="button"
              className=" bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
            >
              {`${
                startDate
                  ? startDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Select"
              } - ${
                dueDate
                  ? dueDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Select"
              }` || "Add a timeline..."}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

Details.Skeleton = function DetailsSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};
