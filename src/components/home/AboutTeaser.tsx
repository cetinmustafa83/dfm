import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const AboutTeaser = () => {
  const t = useTranslations('AboutTeaser');

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="https://www.dfmsolutions.de/wp-content/uploads/2022/12/pflegedienst-berlin-mitte-1024x683.jpg"
              alt="Pfleger und Patient"
              width={500}
              height={333}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
            <p className="text-gray-600 mb-6">{t('text')}</p>
            <Button asChild>
              <Link href="/about">{t('button')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
