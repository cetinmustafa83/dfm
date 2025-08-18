import { z } from 'zod';

export const pageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  content: z.string().min(1, 'Content is required'),
  metaTitle: z.string().max(120).optional(),
  metaDescription: z.string().max(160).optional(),
});

export type PageFormValues = z.infer<typeof pageSchema>;