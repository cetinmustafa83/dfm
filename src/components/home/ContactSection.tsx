"use client";

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const ContactSection = () => {
  const t = useTranslations('ContactSection');

  const formSchema = z.object({
    name: z.string().min(2, { message: t('validation.name') }),
    email: z.string().email({ message: t('validation.email') }),
    phone: z.string().optional(),
    message: z.string().min(10, { message: t('validation.message') }),
    privacy: z.boolean().refine((val) => val === true, { message: t('validation.privacy') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      privacy: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement form submission
    console.log(values);
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('title')}</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4">{t('addressTitle')}</h3>
            <p className="text-gray-600">{t('company')}</p>
            <p className="text-gray-600">{t('street')}</p>
            <p className="text-gray-600">{t('city')}</p>
            <p className="text-gray-600 mt-4">{t('phone')}</p>
            <p className="text-gray-600">{t('fax')}</p>
            <p className="text-gray-600">{t('email')}</p>
            <div className="mt-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2427.863843231578!2d13.41019681580762!3d52.5186236798139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e1f5a5f5a5b%3A0x4e4b4b4b4b4b4b4b!2sKlosterstra%C3%9Fe%2070%2C%2010179%20Berlin!5e0!3m2!1sde!2sde!4v1671016868913!5m2!1sde!2sde"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('form.namePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.email')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('form.emailPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.phone')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('form.phonePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.message')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('form.messagePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="privacy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t('form.privacyLabel')}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit">{t('form.submitButton')}</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
