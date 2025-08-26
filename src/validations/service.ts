import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string()
    .min(1, 'Service title is required')
    .max(100, 'Service title must be less than 100 characters'),
  description: z.string()
    .min(1, 'Service description is required')
    .max(5000, 'Service description must be less than 5000 characters'),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')), // Allow empty string for optional image
  featured: z.preprocess(
    (val) => (val === undefined ? false : val),
    z.boolean()
  ),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
export type ServiceFormInput = Omit<ServiceFormValues, 'featured'> & {
  featured?: boolean;
};