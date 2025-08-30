import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CareerTeaser = () => {
  const t = useTranslations('CareerTeaser');

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{t('text')}</p>
        <Button asChild size="lg">
          <Link href="/career">{t('button')}</Link>
        </Button>
      </div>
    </section>
  );
};

export default CareerTeaser;
