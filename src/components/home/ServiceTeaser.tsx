import { useTranslations } from 'next-intl';
import {
  HeartHandshake,
  Stethoscope,
  Home,
  Clock,
  Users,
  MessageSquare,
} from 'lucide-react';

const ServiceTeaser = () => {
  const t = useTranslations('ServiceTeaser');

  const services = [
    { name: 'basicCare', icon: <HeartHandshake className="h-12 w-12 text-blue-600" /> },
    { name: 'treatmentCare', icon: <Stethoscope className="h-12 w-12 text-blue-600" /> },
    { name: 'housekeeping', icon: <Home className="h-12 w-12 text-blue-600" /> },
    { name: 'respiteCare', icon: <Clock className="h-12 w-12 text-blue-600" /> },
    { name: 'supportServices', icon: <Users className="h-12 w-12 text-blue-600" /> },
    { name: 'consultation', icon: <MessageSquare className="h-12 w-12 text-blue-600" /> },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          {services.map((service) => (
            <div key={service.name} className="flex flex-col items-center">
              {service.icon}
              <h3 className="mt-4 font-semibold">{t(service.name)}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceTeaser;
