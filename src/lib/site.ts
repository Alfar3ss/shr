export const SITE = {
  name: 'SHR Cars Rental',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  phone: process.env.NEXT_PUBLIC_PHONE ?? '+212633337432',
  phoneDisplay: '+212 6 33 33 74 32',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? '212633337432',
  email: 'contact@carrentmorocco.com',
  address: "M'Hamid, Maatallah, No. 912 Marrakech",
  facebook: 'https://www.facebook.com/profile.php?id=61581750707573',
  instagram: 'https://www.instagram.com/locationdevoiture4x4',
  googleMaps:
    'https://www.google.com/maps/place/SHR+Cars+Rental+4x4+Marrakesh+Morocco/@33.0975153,-5.813819,7z/data=!4m8!3m7!1s0xdafef3e0ca727ef:0x213162eaa3159871!8m2!3d33.0975153!4d-5.813819!9m1!1b1!16s%2Fg%2F11xp5gtydm?hl=en',
  googleReviewsShort: 'https://maps.app.goo.gl/2SnGuJ25ZhB5RWqZ9',
  rating: 5.0,
  reviewCount: 85,
};

const OLD = 'https://carrentmorocco.com/wp-content';
export const IMG = {
  logo: `${OLD}/uploads/2025/05/Logo-SHR.jpg`,
  hero: `${OLD}/uploads/2025/10/shrcars_marrakech.jpg`,
  intro: `${OLD}/uploads/2025/06/IMG_8177-1024x768.jpg`,
  gallery: ['casablanca', 'marrakech', 'essaouira', 'fes', 'ouarzazat'].map(
    (n) => `${OLD}/uploads/2025/06/${n}-570x480.jpeg`,
  ),
  blog: [
    `${OLD}/uploads/2025/06/IMG_6255-350x263.jpg`,
    `${OLD}/uploads/2025/06/IMG_4793-350x263.jpg`,
    `${OLD}/uploads/2025/06/IMG_8181-350x263.jpg`,
  ],
};

export const CURRENCIES = { EUR: { symbol: '€', rate: 1 }, MAD: { symbol: 'DH', rate: 10.8 }, USD: { symbol: '$', rate: 1.1 } } as const;
export type CurrencyCode = keyof typeof CURRENCIES;
