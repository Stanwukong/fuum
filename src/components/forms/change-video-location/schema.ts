import { z } from "zod";

export const moveVideosSchema = z.object({
    folder_id: z.string().optional(),
    workspaceId: z.string()
})