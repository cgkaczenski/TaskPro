import { z } from "zod";
import { Project } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { CreateProject } from "./schema";

export type InputType = z.infer<typeof CreateProject>;
export type ReturnType = ActionState<InputType, Project>;
