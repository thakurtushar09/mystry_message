import { z } from "zod";
import { messageSchema } from "@/schemas/messageSchema";
export type Message = z.infer<typeof messageSchema> & { _id: string };

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Message[]; 
}
