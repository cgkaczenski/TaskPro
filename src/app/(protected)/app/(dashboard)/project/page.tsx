"use client";

import { useProject } from "@/hooks/use-project";
import { FolderKanban } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/actions/create-project";
import { useAction } from "@/hooks/use-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ElementRef, useRef, useState } from "react";
import { FormInput } from "@/components/form/form-input";

const ProjectPage = () => {
  const { projects, addProject } = useProject();
  const router = useRouter();
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const onInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    const value = textarea.value;
    if (value.slice(-1) === " ") {
      textarea.value = value.slice(0, -1) + "\n";
    }
  };

  const { execute, fieldErrors, isLoading } = useAction(createProject, {
    onSuccess: (data) => {
      setIsDisabled(true);
      toast.success("Project created!");
      addProject(data);
      router.push(`/app/project/${data.id}`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    await execute({ name });
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          onSubmit(formData);
        }}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project Name
                </label>
                <div className="mt-2">
                  <FormInput
                    errors={fieldErrors}
                    id="name"
                    ref={inputRef}
                    type="text"
                    className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                    placeholder="Enter a project name"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="team"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Team
                </label>
                <div className="mt-2">
                  <Textarea
                    id="team"
                    name="team"
                    rows={5}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                    defaultValue={""}
                    onInput={onInput}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Enter one or more email addresses to invite team members.
                  These team members will be in readonly mode until you change
                  their permissions in the project settings. Your email address
                  does not need to be included.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <FolderKanban />
          {!projects && (
            <>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No projects
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new project.
              </p>
            </>
          )}
          {projects && (
            <>
              <p className="mt-1 text-sm text-gray-500">
                Create a new project.
              </p>
            </>
          )}
          <button
            type="submit"
            className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isLoading || isDisabled
                ? "bg-indigo-100 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600"
            }`}
            disabled={isLoading || isDisabled}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectPage;
