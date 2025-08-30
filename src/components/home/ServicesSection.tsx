import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const ServicesSection = () => {
  const t = useTranslations('ServicesSection');

  const services = [
    {
      name: 'basicCare',
      image: 'https://www.dfmsolutions.de/wp-content/uploads/2022/12/grundpflege-reinickendorf-1-300x200.jpg',
    },
    {
      name: 'treatmentCare',
      image: 'https://www.dfmsolutions.de/wp-content/uploads/2022/12/behandlungspflege-berlin-300x200.jpg',
    },
    {
      name: 'housekeeping',
      image: 'https://www.dfmsolutions.de/wp-content/uploads/2022/12/hauswirtschaft-berlin-300x200.jpg',
    },
    {
      name: 'respiteCare',
      image: 'https://www.dfmsolutions.de/wp-content/uploads/2022/12/verhinderungspflege-berlin-300x200.jpg',
    },
    {
      name: 'supportServices',
      image: 'https://www.dfmsolutions.de/wp-content/uploads/2022/12/betreuung-berlin-300x200.jpg',
    },
    {
      name: 'consultation',
      image: 'https://www.dfmsolutions.de/wp-content/uploads/2022/12/beratung-berlin-300x200.jpg',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('title')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.name}>
              <CardHeader>
                <Image
                  src={service.image}
                  alt={t(`${service.name}.title`)}
                  width={300}
                  height={200}
                  className="rounded-t-lg"
                />
                <CardTitle className="mt-4">{t(`${service.name}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t(`${service.name}.text`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="/services">{t('button')}</Link>
            </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
