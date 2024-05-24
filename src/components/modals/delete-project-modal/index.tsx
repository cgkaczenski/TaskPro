"use client";

import { useDeleteProjectModal } from "@/hooks/use-delete-project-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TriangleAlertIcon } from "lucide-react";
import { useProject } from "@/hooks/use-project";
import { useAction } from "@/hooks/use-action";
import { deleteProject } from "@/actions/delete-project";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export const DeleteProjectModal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOpen = useDeleteProjectModal((state) => state.isOpen);
  const onClose = useDeleteProjectModal((state) => state.onClose);
  const { removeProject } = useProject();
  const router = useRouter();
  const params = useParams();

  const { execute, fieldErrors } = useAction(deleteProject, {
    onSuccess: (data) => {
      toast.success("Project deleted!");
      removeProject(data.id);
      onClose();
      router.push(`/app/project`);
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = () => {
    setIsSubmitting(true);
    const id = params.projectId as string;
    execute({ id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              <>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TriangleAlertIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Delete project
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete your project? This
                        action cannot be undone.
                      </p>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-end">
                      <Button
                        variant="destructive"
                        onClick={onSubmit}
                        className="ml-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Deleting..." : "Delete"}
                      </Button>
                      <Button onClick={onClose} disabled={isSubmitting}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
