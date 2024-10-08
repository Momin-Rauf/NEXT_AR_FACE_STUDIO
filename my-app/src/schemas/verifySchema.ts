import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().regex(/^\d{5}$/, 'Verification code must be exactly 5 digits'),
});
