import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  location: z.string()
    .min(1, 'Location is required')
    .max(100, 'Location must be less than 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be less than 5000 characters'),
  requirements: z.string().optional(),
  active: z.preprocess(
    (val) => (val === undefined ? false : val),
    z.boolean()
  ),
});

export type JobFormValues = z.infer<typeof jobSchema>;
