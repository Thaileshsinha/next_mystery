import { z } from "zod";

export const ascceptMessageSchema = z.object({
  acceptMessages: z.boolean(),
});
