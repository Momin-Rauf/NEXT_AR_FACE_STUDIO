import { z } from "zod";

export const UserFilterSchema = z.object({
  image_url: z.string().nonempty(),
  model_data: z.string().default("default_model_url"),
  category: z.string().default("default_category"),
  title: z.string().default("Untitled"),
  description: z.string().default("No description provided."),
  date: z.date().default(() => new Date()),
  rotation: z.array(z.number()).length(3).default([0, 0, 0]),
  position: z.array(z.number()).length(3).default([0, 0, 0]),
  scale: z.array(z.number()).length(3).default([0.4, 0.4, 0.4]),
  anchor: z.number().default(168),
});
