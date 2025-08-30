import Link from 'next/link';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white">DFM Solutions</h2>
            <p className="mt-2 text-gray-400">{t('slogan')}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t('contact')}</h3>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>{t('address')}</li>
              <li>{t('phone')}</li>
              <li>{t('email')}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t('quickLinks')}</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">{t('home')}</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">{t('about')}</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white">{t('services')}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">{t('contactLink')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t('followUs')}</h3>
            <div className="mt-4 flex space-x-4">
              {/* Social media icons will go here */}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} DFM Solutions. {t('rights')}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/impressum" className="text-gray-500 hover:text-white">{t('imprint')}</Link>
            <Link href="/datenschutz" className="text-gray-500 hover:text-white">{t('privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
