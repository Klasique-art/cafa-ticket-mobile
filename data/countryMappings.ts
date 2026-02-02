// data/countryMappings.ts

/**
 * ISO 2-letter codes to Paystack country codes mapping
 * Split by region for better organization
 */

export const AFRICA_MAPPING: Record<string, string> = {
    'dz': 'algeria', 'ao': 'angola', 'bj': 'benin', 'bw': 'botswana',
    'bf': 'burkina-faso', 'bi': 'burundi', 'cm': 'cameroon', 'cv': 'cape-verde',
    'cf': 'central-african-republic', 'td': 'chad', 'km': 'comoros', 'cg': 'congo',
    'cd': 'democratic-republic-of-congo', 'ci': 'cote-divoire', 'dj': 'djibouti',
    'eg': 'egypt', 'gq': 'equatorial-guinea', 'er': 'eritrea', 'et': 'ethiopia',
    'ga': 'gabon', 'gm': 'gambia', 'gh': 'ghana', 'gn': 'guinea',
    'gw': 'guinea-bissau', 'ke': 'kenya', 'ls': 'lesotho', 'lr': 'liberia',
    'ly': 'libya', 'mg': 'madagascar', 'mw': 'malawi', 'ml': 'mali',
    'mr': 'mauritania', 'mu': 'mauritius', 'ma': 'morocco', 'mz': 'mozambique',
    'na': 'namibia', 'ne': 'niger', 'ng': 'nigeria', 'rw': 'rwanda',
    'st': 'sao-tome-and-principe', 'sn': 'senegal', 'sc': 'seychelles',
    'sl': 'sierra-leone', 'so': 'somalia', 'za': 'south-africa', 'ss': 'south-sudan',
    'sd': 'sudan', 'sz': 'eswatini', 'tz': 'tanzania', 'tg': 'togo',
    'tn': 'tunisia', 'ug': 'uganda', 'zm': 'zambia', 'zw': 'zimbabwe',
};

export const AMERICAS_MAPPING: Record<string, string> = {
    'ar': 'argentina', 'bz': 'belize', 'bo': 'bolivia', 'br': 'brazil',
    'ca': 'canada', 'cl': 'chile', 'co': 'colombia', 'cr': 'costa-rica',
    'cu': 'cuba', 'do': 'dominican-republic', 'ec': 'ecuador', 'sv': 'el-salvador',
    'gt': 'guatemala', 'hn': 'honduras', 'jm': 'jamaica', 'mx': 'mexico',
    'ni': 'nicaragua', 'pa': 'panama', 'py': 'paraguay', 'pe': 'peru',
    'tt': 'trinidad-and-tobago', 'us': 'united-states', 'uy': 'uruguay', 've': 'venezuela',
};

export const ASIA_MAPPING: Record<string, string> = {
    'af': 'afghanistan', 'bd': 'bangladesh', 'bt': 'bhutan', 'bn': 'brunei',
    'kh': 'cambodia', 'cn': 'china', 'in': 'india', 'id': 'indonesia',
    'ir': 'iran', 'iq': 'iraq', 'il': 'israel', 'jp': 'japan',
    'jo': 'jordan', 'kz': 'kazakhstan', 'kw': 'kuwait', 'kg': 'kyrgyzstan',
    'la': 'laos', 'lb': 'lebanon', 'my': 'malaysia', 'mv': 'maldives',
    'mn': 'mongolia', 'mm': 'myanmar', 'np': 'nepal', 'kp': 'north-korea',
    'om': 'oman', 'pk': 'pakistan', 'ps': 'palestine', 'ph': 'philippines',
    'qa': 'qatar', 'sa': 'saudi-arabia', 'sg': 'singapore', 'kr': 'south-korea',
    'lk': 'sri-lanka', 'sy': 'syria', 'tw': 'taiwan', 'tj': 'tajikistan',
    'th': 'thailand', 'tl': 'timor-leste', 'tr': 'turkey', 'tm': 'turkmenistan',
    'ae': 'united-arab-emirates', 'uz': 'uzbekistan', 'vn': 'vietnam', 'ye': 'yemen',
};

export const EUROPE_MAPPING: Record<string, string> = {
    'al': 'albania', 'ad': 'andorra', 'am': 'armenia', 'at': 'austria',
    'az': 'azerbaijan', 'by': 'belarus', 'be': 'belgium', 'ba': 'bosnia-and-herzegovina',
    'bg': 'bulgaria', 'hr': 'croatia', 'cy': 'cyprus', 'cz': 'czech-republic',
    'dk': 'denmark', 'ee': 'estonia', 'fi': 'finland', 'fr': 'france',
    'ge': 'georgia', 'de': 'germany', 'gr': 'greece', 'hu': 'hungary',
    'is': 'iceland', 'ie': 'ireland', 'it': 'italy', 'xk': 'kosovo',
    'lv': 'latvia', 'li': 'liechtenstein', 'lt': 'lithuania', 'lu': 'luxembourg',
    'mk': 'north-macedonia', 'mt': 'malta', 'md': 'moldova', 'mc': 'monaco',
    'me': 'montenegro', 'nl': 'netherlands', 'no': 'norway', 'pl': 'poland',
    'pt': 'portugal', 'ro': 'romania', 'ru': 'russia', 'sm': 'san-marino',
    'rs': 'serbia', 'sk': 'slovakia', 'si': 'slovenia', 'es': 'spain',
    'se': 'sweden', 'ch': 'switzerland', 'ua': 'ukraine', 'gb': 'united-kingdom',
    'va': 'vatican-city',
};

export const OCEANIA_MAPPING: Record<string, string> = {
    'au': 'australia', 'fj': 'fiji', 'ki': 'kiribati', 'mh': 'marshall-islands',
    'fm': 'micronesia', 'nr': 'nauru', 'nz': 'new-zealand', 'pw': 'palau',
    'pg': 'papua-new-guinea', 'ws': 'samoa', 'sb': 'solomon-islands',
    'to': 'tonga', 'tv': 'tuvalu', 'vu': 'vanuatu',
};

// Combine all mappings
export const ISO_TO_PAYSTACK: Record<string, string> = {
    ...AFRICA_MAPPING,
    ...AMERICAS_MAPPING,
    ...ASIA_MAPPING,
    ...EUROPE_MAPPING,
    ...OCEANIA_MAPPING,
};