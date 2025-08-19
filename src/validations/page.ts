import { z } from 'zod';

// Define the base schema where 'published' is optional, to be used for initial data
const basePageSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens')
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
      message: 'Slug cannot start or end with a hyphen',
    }),
  content: z.string()
    .min(1, 'Content is required')
    .max(10000, 'Content must be less than 10,000 characters'),
  metaTitle: z.string()
    .max(120, 'Meta title must be less than 120 characters')
    .optional(),
  metaDescription: z.string()
    .max(160, 'Meta description must be less than 160 characters')
    .optional(),
  published: z.boolean().optional(), // Explicitly optional for raw input
});

// This is the schema used for form validation, ensuring 'published' defaults to false if not provided
export const pageSchema = basePageSchema.extend({
  published: basePageSchema.shape.published.default(false), // Apply default for the final validated type
});

export type PageFormValues = z.infer<typeof pageSchema>; // Type for validated form data (published: boolean)
export type PageFormInput = z.infer<typeof basePageSchema>; // Type for initial input data (published?: boolean)