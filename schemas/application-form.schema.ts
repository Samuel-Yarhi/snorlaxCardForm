import { z } from "zod";
import { PersonalInfoSchema } from "./personal-info.schema";
import { ExperienceSchema } from "./experience.schema";

export const ApplicationFormSchema = PersonalInfoSchema.merge(ExperienceSchema);

export type ApplicationForm = z.infer<typeof ApplicationFormSchema>;