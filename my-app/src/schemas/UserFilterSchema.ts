import {z} from "zod"

export const UserFilterSchema = z.object({
    image_url: z.string(),
    model_url:z.string(),
    category:z.string(),
})