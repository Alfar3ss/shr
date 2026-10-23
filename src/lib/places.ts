const OLD = 'https://carrentmorocco.com/wp-content/uploads';

export type City = { slug: string; name: string; image: string; label: string };

export const CITIES: City[] = [
  { slug: 'marrakech', name: 'Marrakech', label: 'Marrakech Aéroport/Downtown', image: `${OLD}/2025/10/shrcars_marrakech.jpg` },
  { slug: 'casablanca', name: 'Casablanca', label: 'Casablanca Aéroport', image: `${OLD}/2025/10/shrcars_casablanca.jpg` },
  { slug: 'agadir', name: 'Agadir', label: 'Agadir Aéroport/Downtown', image: `${OLD}/2025/10/shrcars_agadir.jpg` },
  { slug: 'rabat', name: 'Rabat', label: 'Rabat Aéroport/Downtown', image: `${OLD}/2025/10/shrcars_rabat.jpg` },
  { slug: 'essaouira', name: 'Essaouira', label: 'Essaouira Aéroport/Downtown', image: `${OLD}/2025/10/shrcars_essaouira.jpg` },
  { slug: 'fes', name: 'Fes', label: 'Fes Aéroport/Downtown', image: `${OLD}/2025/10/shrcars_fes.jpg` },
  { slug: 'errachidia', name: 'Errachidia', label: 'Errachidia Aéroport /Downtown', image: `${OLD}/2025/10/shrcars_errachidia.jpg` },
  { slug: 'tanger', name: 'Tanger', label: 'Tanger Aéroport/ Med/Ville', image: `${OLD}/2025/11/shrcars_tanger.jpg` },
  { slug: 'meknes', name: 'Meknes', label: 'Meknes', image: `${OLD}/2025/11/shrcars_meknes.jpg` },
  { slug: 'ouarzazate', name: 'Ouarzazate', label: 'Ouarzazate Aéroport/Downtown', image: `${OLD}/2025/11/shrcars_ouarzazate.jpg` },
  { slug: 'merzouga', name: 'Merzouga', label: 'Merzouga', image: `${OLD}/2025/11/shrcars_merzouga.jpg` },
];

// Extra pickup point that exists in the old search form but has no landing page
export const PLACES = [
  ...CITIES.map((c) => ({ value: c.slug, label: c.label })),
  { value: 'beni-mellal', label: 'Béni Mellal Aéroport/Downtown' },
];

export const placeLabel = (value: string) => PLACES.find((p) => p.value === value)?.label ?? value;
export const cityBySlug = (slug: string) => CITIES.find((c) => c.slug === slug) ?? null;
