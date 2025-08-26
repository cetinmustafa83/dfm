import { z } from 'zod';

// Schema for the data that the form will handle and submit.
// 'published' is a required boolean with a default.
export const pageSchema = z.object({
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
  // Use preprocess to handle potential undefined input for 'published' before validation
  published: z.preprocess(
    (val) => (val === undefined ? false : val), // If undefined, treat as false
    z.boolean()
  ),
});

export type PageFormValues = z.infer<typeof pageSchema>;

// Type for incoming data that might have 'published' as optional.
// This is used for 'initialData' in components.
export type PageFormInput = Omit<PageFormValues, 'published'> & {
  published?: boolean;
};