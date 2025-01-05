import { z } from "zod";

export const PersonalInfoSchema = z.object({
  //Set 5 as minimum and 50 as maximum
  fullName: z.string().min(5, "Full name must be at least 5 characters").max(50, "Full name must be at most 50 characters"),
  email: z.string().email(),
  //Minimum of 7 digits and max of 15 for typical valid phone numbers worldwide
  phone: z.string()
    .regex(/^\+\d{1,3} ?\d{6,14}$/, "Invalid phone number format"),
  //Structure location as country and city
  location: z.object({
    country: z.string().nonempty("Country is required"),
    city: z.string().nonempty("City is required"),
  }),
  portfolioUrl: z.string()
    .optional()
    .refine((val) => val === undefined || val.trim() === '' || z.string().url().safeParse(val).success, {
      message: "Invalid URL format",
    }),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
