import { z } from "zod";
export const leadSchema=z.object({
  firstName:z.string().trim().min(1).max(60), lastName:z.string().trim().max(60).optional().default(""),
  phone:z.string().trim().min(7).max(30).regex(/^[+()\-\.\s\d]+$/), email:z.union([z.literal(""),z.string().trim().email().max(120)]).optional().default(""),
  location:z.string().trim().min(2).max(80), timing:z.enum(["today","yesterday","2-3-days","earlier","not-sure"]),
  incident:z.enum(["active-leak","appliance","roof","flood","sewage","mold","other"]), details:z.string().trim().min(10).max(1500),
  website:z.string().max(0).optional().default(""), turnstileToken:z.string().min(1).max(2048)
});
export type Lead= z.infer<typeof leadSchema>;
