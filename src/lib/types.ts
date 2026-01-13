import { z } from "zod";

export const CONTRACT_TYPES = ["CDI", "CDD", "Freelance", "Internship", "Apprenticeship"] as const;
export const SOURCES = ["LinkedIn", "Indeed", "Company website", "Referral", "Recruiter", "APEC", "Welcome to the Jungle", "Other"] as const;
export const COUNTRIES = ["France", "Luxembourg", "Remote", "Belgium", "Switzerland", "Germany"] as const;
export const STATUSES = ["To apply", "Applied", "Screening", "Interview", "Technical test", "Final interview", "Offer", "Rejected", "Offer accepted", "Offer declined", "On hold"] as const;
export const STAGES = ["Prospecting", "Applied", "In process", "Offer stage", "Closed"] as const;
export const FOLLOWUP_TYPES = ["Email", "LinkedIn message", "Phone call", "Follow-up email", "Thank you note", "Other"] as const;

export const ApplicationSchema = z.object({
    id: z.string().optional(),
    company: z.string().min(1, "Requis"),
    role: z.string().min(1, "Requis"),
    contract: z.enum(CONTRACT_TYPES),
    source: z.enum(SOURCES),
    country: z.enum(COUNTRIES),
    status: z.enum(STATUSES),
    stage: z.enum(STAGES).optional(),
    dateApplied: z.coerce.date(),
    lastUpdate: z.coerce.date().optional(),
    nextActionDate: z.coerce.date().nullable().optional(),
    nextActionType: z.enum(FOLLOWUP_TYPES).nullable().optional(),
    nextActionDetails: z.string().nullable().optional(),
    jobLink: z.string().optional().or(z.literal("")),
    contactName: z.string().optional(),
    contactEmail: z.string().optional().or(z.literal("")),
    salaryTarget: z.number().optional(),
    notes: z.string().optional(),
    userId: z.string()
});

export type Application = z.infer<typeof ApplicationSchema>;
