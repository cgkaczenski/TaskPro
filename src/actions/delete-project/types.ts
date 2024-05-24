import { z } from "zod";
import { Project } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { DeleteProject } from "./schema";

export type InputType = z.infer<typeof DeleteProject>;
export type ReturnType = ActionState<InputType, Project>;
