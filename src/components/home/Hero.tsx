import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <div
      className="relative bg-cover bg-center h-[500px]"
      style={{ backgroundImage: "url('https://www.dfmsolutions.de/wp-content/uploads/2022/12/pflegedienst-wittenau-reinickendorf-1536x512.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold">{t('title')}</h1>
        <p className="mt-4 text-lg md:text-xl">{t('subtitle')}</p>
        <Button asChild className="mt-8">
          <Link href="/contact">{t('contactButton')}</Link>
        </Button>
      </div>
    </div>
  );
};

export default Hero;
