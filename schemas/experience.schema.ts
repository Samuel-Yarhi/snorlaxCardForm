import { z } from "zod";

//todo: create ExperienceSchema
// json contract example bellow
export const ExperienceSchema = z.object({
    currentRole: z.string().nonempty("Current role is required"), // Optional: Add a message for required fields
    yearsOfExperience: z.number().min(0, "Must be a non-negative number"), // Optional: Add a message for validation
    skills: z.array(z.string()).nonempty("At least one skill is required"), // Ensure skills is an array of strings
    company: z.string().nonempty("Company name is required"), // Ensure company is a non-empty string
});

export type Experience = z.infer<typeof ExperienceSchema>;
