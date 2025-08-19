"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pageSchema, PageFormValues, PageFormInput } from '@/validations/page';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PageEditorProps {
  initialData?: PageFormInput & { id?: string };
}

export default function PageEditor({ initialData }: PageEditorProps) {
  const router = useRouter();
  
  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      content: initialData?.content || '',
      metaTitle: initialData?.metaTitle || '',
      metaDescription: initialData?.metaDescription || '',
      published: initialData?.published ?? false // Ensure published is always a boolean for the form
    }
  });

  useEffect(() => {
    // Auto-generate slug if it's a new page and title is typed
    if (!initialData?.id && !form.getValues('slug')) {
      const generatedSlug = form.getValues('title')
        ?.toLowerCase()
        ?.replace(/\s+/g, '-')
        ?.replace(/[^a-z0-9-]/g, '');
      form.setValue('slug', generatedSlug || '');
    }
  }, [form, form.watch('title'), initialData]);

  const onSubmit = async (values: PageFormValues) => {
    try {
      const url = initialData?.id 
        ? `/api/content/pages?id=${initialData.id}`
        : '/api/content/pages';
      const method = initialData?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success('Page saved successfully');
        if (!initialData?.id) { 
          router.push('/admin/pages'); // Redirect to pages list after creating a new page
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save page');
      }
    } catch (error) {
      toast.error('Network error - please try again');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-muted-foreground">/</div>
                  <Input
                    {...field}
                    className="pl-7"
                    onBlur={(e) => {
                      // Format slug on blur
                      const formattedSlug = e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '');
                      form.setValue('slug', formattedSlug);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground mt-1">
                Example: about-us or services
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Content</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[300px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title (optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description (optional)</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Publish Status</FormLabel>
                <p className="text-sm text-muted-foreground">
                  {field.value ? 'Visible publicly' : 'Draft mode'}
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Page'}
          </Button>
          <Button 
            variant="secondary"
            type="button"
            onClick={() => router.push('/admin/pages')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}