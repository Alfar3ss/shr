import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'fr', 'es', 'de', 'nl', 'it'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en', // English lives at /, others at /fr /es /de /nl /it
  localePrefix: 'as-needed',
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/our-cars': {
      en: '/our-cars', fr: '/nos-voitures', es: '/nuestros-coches',
      de: '/unsere-autos', nl: '/onze-auto-s', it: '/le-nostre-auto',
    },
    '/car/[slug]': {
      en: '/car/[slug]', fr: '/voiture/[slug]', es: '/coche/[slug]',
      de: '/auto/[slug]', nl: '/auto/[slug]', it: '/auto/[slug]',
    },
    '/book/[slug]': {
      en: '/book/[slug]', fr: '/reserver/[slug]', es: '/reservar/[slug]',
      de: '/buchen/[slug]', nl: '/boeken/[slug]', it: '/prenota/[slug]',
    },
    '/booking/[code]': {
      en: '/booking/[code]', fr: '/reservation/[code]', es: '/reserva/[code]',
      de: '/buchung/[code]', nl: '/boeking/[code]', it: '/prenotazione/[code]',
    },
    '/car-rental/[city]': {
      en: '/car-rental/[city]', fr: '/location-voiture/[city]', es: '/alquiler-coches/[city]',
      de: '/mietwagen/[city]', nl: '/autohuur/[city]', it: '/noleggio-auto/[city]',
    },
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/contact': {
      en: '/contact', fr: '/contact', es: '/contacto', de: '/kontakt', nl: '/contact', it: '/contatti',
    },
    '/about': {
      en: '/about', fr: '/a-propos', es: '/sobre-nosotros', de: '/ueber-uns', nl: '/over-ons', it: '/chi-siamo',
    },
    '/gallery': {
      en: '/gallery', fr: '/galerie', es: '/galeria', de: '/galerie', nl: '/galerij', it: '/galleria',
    },
    '/rental-conditions': {
      en: '/rental-conditions', fr: '/conditions-de-location', es: '/condiciones-de-alquiler',
      de: '/mietbedingungen', nl: '/huurvoorwaarden', it: '/condizioni-di-noleggio',
    },
  },
});
