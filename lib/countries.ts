export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  pattern: string;
  placeholder: string;
  maxLength: number;
}

export const countries: Country[] = [
  // Popular countries first
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', pattern: '^\\+61[0-9]{9}$', placeholder: '4XX XXX XXX', maxLength: 9 },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', pattern: '^\\+1[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', pattern: '^\\+44[0-9]{10}$', placeholder: 'XXXX XXX XXX', maxLength: 10 },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', pattern: '^\\+64[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', pattern: '^\\+1[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  
  // South Asia
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', pattern: '^\\+91[0-9]{10}$', placeholder: 'XXXXX XXXXX', maxLength: 10 },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', pattern: '^\\+92[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩', pattern: '^\\+880[0-9]{10}$', placeholder: 'XXXX XXX XXX', maxLength: 10 },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰', pattern: '^\\+94[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵', pattern: '^\\+977[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫', pattern: '^\\+93[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'BT', name: 'Bhutan', dialCode: '+975', flag: '🇧🇹', pattern: '^\\+975[0-9]{8}$', placeholder: 'XX XXX XXX', maxLength: 8 },
  { code: 'MV', name: 'Maldives', dialCode: '+960', flag: '🇲🇻', pattern: '^\\+960[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  
  // East Asia
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', pattern: '^\\+86[0-9]{11}$', placeholder: 'XXX XXXX XXXX', maxLength: 11 },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', pattern: '^\\+81[0-9]{10}$', placeholder: 'XX XXXX XXXX', maxLength: 10 },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', pattern: '^\\+82[0-9]{10}$', placeholder: 'XX XXXX XXXX', maxLength: 10 },
  { code: 'KP', name: 'North Korea', dialCode: '+850', flag: '🇰🇵', pattern: '^\\+850[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'MN', name: 'Mongolia', dialCode: '+976', flag: '🇲🇳', pattern: '^\\+976[0-9]{8}$', placeholder: 'XX XX XXXX', maxLength: 8 },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰', pattern: '^\\+852[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'MO', name: 'Macau', dialCode: '+853', flag: '🇲🇴', pattern: '^\\+853[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼', pattern: '^\\+886[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  
  // Southeast Asia
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', pattern: '^\\+65[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', pattern: '^\\+60[0-9]{10}$', placeholder: 'XX XXX XXXX', maxLength: 10 },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', pattern: '^\\+66[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', pattern: '^\\+63[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', pattern: '^\\+62[0-9]{11}$', placeholder: 'XXX XXXX XXXX', maxLength: 11 },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳', pattern: '^\\+84[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲', pattern: '^\\+95[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'KH', name: 'Cambodia', dialCode: '+855', flag: '🇰🇭', pattern: '^\\+855[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦', pattern: '^\\+856[0-9]{10}$', placeholder: 'XX XXXX XXXX', maxLength: 10 },
  { code: 'BN', name: 'Brunei', dialCode: '+673', flag: '🇧🇳', pattern: '^\\+673[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'TL', name: 'Timor-Leste', dialCode: '+670', flag: '🇹🇱', pattern: '^\\+670[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  
  // Middle East
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪', pattern: '^\\+971[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', pattern: '^\\+966[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱', pattern: '^\\+972[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦', pattern: '^\\+974[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼', pattern: '^\\+965[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭', pattern: '^\\+973[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲', pattern: '^\\+968[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴', pattern: '^\\+962[0-9]{9}$', placeholder: 'X XXXX XXXX', maxLength: 9 },
  { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧', pattern: '^\\+961[0-9]{8}$', placeholder: 'XX XXX XXX', maxLength: 8 },
  { code: 'SY', name: 'Syria', dialCode: '+963', flag: '🇸🇾', pattern: '^\\+963[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶', pattern: '^\\+964[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'IR', name: 'Iran', dialCode: '+98', flag: '🇮🇷', pattern: '^\\+98[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'YE', name: 'Yemen', dialCode: '+967', flag: '🇾🇪', pattern: '^\\+967[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'PS', name: 'Palestine', dialCode: '+970', flag: '🇵🇸', pattern: '^\\+970[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  
  // Central Asia
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿', pattern: '^\\+7[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', flag: '🇺🇿', pattern: '^\\+998[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'TM', name: 'Turkmenistan', dialCode: '+993', flag: '🇹🇲', pattern: '^\\+993[0-9]{8}$', placeholder: 'XX XXXXXX', maxLength: 8 },
  { code: 'TJ', name: 'Tajikistan', dialCode: '+992', flag: '🇹🇯', pattern: '^\\+992[0-9]{9}$', placeholder: 'XXX XX XXXX', maxLength: 9 },
  { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996', flag: '🇰🇬', pattern: '^\\+996[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  
  // Europe - Western
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', pattern: '^\\+49[0-9]{11}$', placeholder: 'XXX XXXXXXXX', maxLength: 11 },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', pattern: '^\\+33[0-9]{9}$', placeholder: 'X XX XX XX XX', maxLength: 9 },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', pattern: '^\\+39[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', pattern: '^\\+34[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', pattern: '^\\+31[0-9]{9}$', placeholder: 'X XXXX XXXX', maxLength: 9 },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪', pattern: '^\\+32[0-9]{9}$', placeholder: 'XXX XX XX XX', maxLength: 9 },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', pattern: '^\\+41[0-9]{9}$', placeholder: 'XX XXX XX XX', maxLength: 9 },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹', pattern: '^\\+43[0-9]{10}$', placeholder: 'XXX XXXXXXX', maxLength: 10 },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺', pattern: '^\\+352[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'MC', name: 'Monaco', dialCode: '+377', flag: '🇲🇨', pattern: '^\\+377[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'LI', name: 'Liechtenstein', dialCode: '+423', flag: '🇱🇮', pattern: '^\\+423[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  
  // Europe - Northern
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', pattern: '^\\+46[0-9]{9}$', placeholder: 'XX XXX XX XX', maxLength: 9 },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴', pattern: '^\\+47[0-9]{8}$', placeholder: 'XXX XX XXX', maxLength: 8 },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰', pattern: '^\\+45[0-9]{8}$', placeholder: 'XX XX XX XX', maxLength: 8 },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮', pattern: '^\\+358[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'IS', name: 'Iceland', dialCode: '+354', flag: '🇮🇸', pattern: '^\\+354[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', pattern: '^\\+353[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  
  // Europe - Southern
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', pattern: '^\\+351[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷', pattern: '^\\+30[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', pattern: '^\\+90[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: '🇨🇾', pattern: '^\\+357[0-9]{8}$', placeholder: 'XX XXXXXX', maxLength: 8 },
  { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹', pattern: '^\\+356[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'AD', name: 'Andorra', dialCode: '+376', flag: '🇦🇩', pattern: '^\\+376[0-9]{6}$', placeholder: 'XXX XXX', maxLength: 6 },
  { code: 'SM', name: 'San Marino', dialCode: '+378', flag: '🇸🇲', pattern: '^\\+378[0-9]{10}$', placeholder: 'XXXX XXXXXX', maxLength: 10 },
  { code: 'VA', name: 'Vatican City', dialCode: '+379', flag: '🇻🇦', pattern: '^\\+379[0-9]{10}$', placeholder: 'XXXXXXXXXX', maxLength: 10 },
  
  // Europe - Eastern
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱', pattern: '^\\+48[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿', pattern: '^\\+420[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: '🇸🇰', pattern: '^\\+421[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺', pattern: '^\\+36[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴', pattern: '^\\+40[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬', pattern: '^\\+359[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷', pattern: '^\\+385[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: '🇸🇮', pattern: '^\\+386[0-9]{8}$', placeholder: 'XX XXX XXX', maxLength: 8 },
  { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸', pattern: '^\\+381[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'BA', name: 'Bosnia', dialCode: '+387', flag: '🇧🇦', pattern: '^\\+387[0-9]{8}$', placeholder: 'XX XXX XXX', maxLength: 8 },
  { code: 'ME', name: 'Montenegro', dialCode: '+382', flag: '🇲🇪', pattern: '^\\+382[0-9]{8}$', placeholder: 'XX XXX XXX', maxLength: 8 },
  { code: 'MK', name: 'North Macedonia', dialCode: '+389', flag: '🇲🇰', pattern: '^\\+389[0-9]{8}$', placeholder: 'XX XXX XXX', maxLength: 8 },
  { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱', pattern: '^\\+355[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'XK', name: 'Kosovo', dialCode: '+383', flag: '🇽🇰', pattern: '^\\+383[0-9]{8}$', placeholder: 'XX XXX XXX', maxLength: 8 },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺', pattern: '^\\+7[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦', pattern: '^\\+380[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'BY', name: 'Belarus', dialCode: '+375', flag: '🇧🇾', pattern: '^\\+375[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'MD', name: 'Moldova', dialCode: '+373', flag: '🇲🇩', pattern: '^\\+373[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  
  // Europe - Baltic
  { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪', pattern: '^\\+372[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'LV', name: 'Latvia', dialCode: '+371', flag: '🇱🇻', pattern: '^\\+371[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: '🇱🇹', pattern: '^\\+370[0-9]{8}$', placeholder: 'XXX XXXXX', maxLength: 8 },
  
  // Caucasus
  { code: 'GE', name: 'Georgia', dialCode: '+995', flag: '🇬🇪', pattern: '^\\+995[0-9]{9}$', placeholder: 'XXX XX XX XX', maxLength: 9 },
  { code: 'AM', name: 'Armenia', dialCode: '+374', flag: '🇦🇲', pattern: '^\\+374[0-9]{8}$', placeholder: 'XX XXXXXX', maxLength: 8 },
  { code: 'AZ', name: 'Azerbaijan', dialCode: '+994', flag: '🇦🇿', pattern: '^\\+994[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  
  // North America
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', pattern: '^\\+52[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺', pattern: '^\\+53[0-9]{8}$', placeholder: 'X XXX XXXX', maxLength: 8 },
  { code: 'JM', name: 'Jamaica', dialCode: '+1876', flag: '🇯🇲', pattern: '^\\+1876[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'HT', name: 'Haiti', dialCode: '+509', flag: '🇭🇹', pattern: '^\\+509[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'DO', name: 'Dominican Republic', dialCode: '+1809', flag: '🇩🇴', pattern: '^\\+1809[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'PR', name: 'Puerto Rico', dialCode: '+1787', flag: '🇵🇷', pattern: '^\\+1787[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'TT', name: 'Trinidad and Tobago', dialCode: '+1868', flag: '🇹🇹', pattern: '^\\+1868[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'BB', name: 'Barbados', dialCode: '+1246', flag: '🇧🇧', pattern: '^\\+1246[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'BS', name: 'Bahamas', dialCode: '+1242', flag: '🇧🇸', pattern: '^\\+1242[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  
  // Central America
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹', pattern: '^\\+502[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳', pattern: '^\\+504[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻', pattern: '^\\+503[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮', pattern: '^\\+505[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷', pattern: '^\\+506[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'PA', name: 'Panama', dialCode: '+507', flag: '🇵🇦', pattern: '^\\+507[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'BZ', name: 'Belize', dialCode: '+501', flag: '🇧🇿', pattern: '^\\+501[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  
  // South America
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', pattern: '^\\+55[0-9]{11}$', placeholder: 'XX XXXXX XXXX', maxLength: 11 },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', pattern: '^\\+54[0-9]{10}$', placeholder: 'XX XXXX XXXX', maxLength: 10 },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱', pattern: '^\\+56[0-9]{9}$', placeholder: 'X XXXX XXXX', maxLength: 9 },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', pattern: '^\\+57[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪', pattern: '^\\+51[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪', pattern: '^\\+58[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨', pattern: '^\\+593[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴', pattern: '^\\+591[0-9]{8}$', placeholder: 'X XXX XXXX', maxLength: 8 },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾', pattern: '^\\+595[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾', pattern: '^\\+598[0-9]{8}$', placeholder: 'X XXX XXXX', maxLength: 8 },
  { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾', pattern: '^\\+592[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'SR', name: 'Suriname', dialCode: '+597', flag: '🇸🇷', pattern: '^\\+597[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'GF', name: 'French Guiana', dialCode: '+594', flag: '🇬🇫', pattern: '^\\+594[0-9]{9}$', placeholder: 'XXX XX XX XX', maxLength: 9 },
  
  // Africa - North
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', pattern: '^\\+20[0-9]{10}$', placeholder: 'XX XXXX XXXX', maxLength: 10 },
  { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾', pattern: '^\\+218[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳', pattern: '^\\+216[0-9]{8}$', placeholder: 'XX XXX XXX', maxLength: 8 },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿', pattern: '^\\+213[0-9]{9}$', placeholder: 'XXX XX XX XX', maxLength: 9 },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦', pattern: '^\\+212[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩', pattern: '^\\+249[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  
  // Africa - West
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', pattern: '^\\+234[0-9]{10}$', placeholder: 'XXX XXX XXXX', maxLength: 10 },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', pattern: '^\\+233[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'CI', name: 'Ivory Coast', dialCode: '+225', flag: '🇨🇮', pattern: '^\\+225[0-9]{10}$', placeholder: 'XX XX XXX XXX', maxLength: 10 },
  { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳', pattern: '^\\+221[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱', pattern: '^\\+223[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫', pattern: '^\\+226[0-9]{8}$', placeholder: 'XX XX XX XX', maxLength: 8 },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪', pattern: '^\\+227[0-9]{8}$', placeholder: 'XX XX XX XX', maxLength: 8 },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬', pattern: '^\\+228[0-9]{8}$', placeholder: 'XX XX XX XX', maxLength: 8 },
  { code: 'BJ', name: 'Benin', dialCode: '+229', flag: '🇧🇯', pattern: '^\\+229[0-9]{8}$', placeholder: 'XX XX XXXX', maxLength: 8 },
  { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: '🇲🇷', pattern: '^\\+222[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'GM', name: 'Gambia', dialCode: '+220', flag: '🇬🇲', pattern: '^\\+220[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'GN', name: 'Guinea', dialCode: '+224', flag: '🇬🇳', pattern: '^\\+224[0-9]{9}$', placeholder: 'XXX XX XX XX', maxLength: 9 },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱', pattern: '^\\+232[0-9]{8}$', placeholder: 'XX XXX XXX', maxLength: 8 },
  { code: 'LR', name: 'Liberia', dialCode: '+231', flag: '🇱🇷', pattern: '^\\+231[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'CV', name: 'Cape Verde', dialCode: '+238', flag: '🇨🇻', pattern: '^\\+238[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼', pattern: '^\\+245[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  
  // Africa - East
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', pattern: '^\\+254[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿', pattern: '^\\+255[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬', pattern: '^\\+256[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼', pattern: '^\\+250[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮', pattern: '^\\+257[0-9]{8}$', placeholder: 'XX XX XXXX', maxLength: 8 },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹', pattern: '^\\+251[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: '🇪🇷', pattern: '^\\+291[0-9]{7}$', placeholder: 'X XXX XXX', maxLength: 7 },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯', pattern: '^\\+253[0-9]{8}$', placeholder: 'XX XX XX XX', maxLength: 8 },
  { code: 'SO', name: 'Somalia', dialCode: '+252', flag: '🇸🇴', pattern: '^\\+252[0-9]{8}$', placeholder: 'XX XXX XXX', maxLength: 8 },
  { code: 'SS', name: 'South Sudan', dialCode: '+211', flag: '🇸🇸', pattern: '^\\+211[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  
  // Africa - Central
  { code: 'CD', name: 'DR Congo', dialCode: '+243', flag: '🇨🇩', pattern: '^\\+243[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬', pattern: '^\\+242[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲', pattern: '^\\+237[0-9]{9}$', placeholder: 'X XX XX XX XX', maxLength: 9 },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦', pattern: '^\\+241[0-9]{8}$', placeholder: 'X XX XX XX', maxLength: 8 },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶', pattern: '^\\+240[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'CF', name: 'Central African Republic', dialCode: '+236', flag: '🇨🇫', pattern: '^\\+236[0-9]{8}$', placeholder: 'XX XX XX XX', maxLength: 8 },
  { code: 'TD', name: 'Chad', dialCode: '+235', flag: '🇹🇩', pattern: '^\\+235[0-9]{8}$', placeholder: 'XX XX XX XX', maxLength: 8 },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴', pattern: '^\\+244[0-9]{9}$', placeholder: 'XXX XXX XXX', maxLength: 9 },
  { code: 'ST', name: 'Sao Tome and Principe', dialCode: '+239', flag: '🇸🇹', pattern: '^\\+239[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  
  // Africa - Southern
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', pattern: '^\\+27[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼', pattern: '^\\+263[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: '🇿🇲', pattern: '^\\+260[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼', pattern: '^\\+265[0-9]{9}$', placeholder: 'X XXXX XXXX', maxLength: 9 },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿', pattern: '^\\+258[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼', pattern: '^\\+267[0-9]{8}$', placeholder: 'XX XXX XXX', maxLength: 8 },
  { code: 'NA', name: 'Namibia', dialCode: '+264', flag: '🇳🇦', pattern: '^\\+264[0-9]{9}$', placeholder: 'XX XXX XXXX', maxLength: 9 },
  { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸', pattern: '^\\+266[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: '🇸🇿', pattern: '^\\+268[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬', pattern: '^\\+261[0-9]{9}$', placeholder: 'XX XX XXX XX', maxLength: 9 },
  { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: '🇲🇺', pattern: '^\\+230[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨', pattern: '^\\+248[0-9]{7}$', placeholder: 'X XX XX XX', maxLength: 7 },
  { code: 'KM', name: 'Comoros', dialCode: '+269', flag: '🇰🇲', pattern: '^\\+269[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'RE', name: 'Reunion', dialCode: '+262', flag: '🇷🇪', pattern: '^\\+262[0-9]{9}$', placeholder: 'XXX XX XX XX', maxLength: 9 },
  
  // Oceania
  { code: 'FJ', name: 'Fiji', dialCode: '+679', flag: '🇫🇯', pattern: '^\\+679[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'PG', name: 'Papua New Guinea', dialCode: '+675', flag: '🇵🇬', pattern: '^\\+675[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'WS', name: 'Samoa', dialCode: '+685', flag: '🇼🇸', pattern: '^\\+685[0-9]{7}$', placeholder: 'XX XXXXX', maxLength: 7 },
  { code: 'TO', name: 'Tonga', dialCode: '+676', flag: '🇹🇴', pattern: '^\\+676[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'VU', name: 'Vanuatu', dialCode: '+678', flag: '🇻🇺', pattern: '^\\+678[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'SB', name: 'Solomon Islands', dialCode: '+677', flag: '🇸🇧', pattern: '^\\+677[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'NC', name: 'New Caledonia', dialCode: '+687', flag: '🇳🇨', pattern: '^\\+687[0-9]{6}$', placeholder: 'XX XX XX', maxLength: 6 },
  { code: 'PF', name: 'French Polynesia', dialCode: '+689', flag: '🇵🇫', pattern: '^\\+689[0-9]{8}$', placeholder: 'XX XX XX XX', maxLength: 8 },
  { code: 'GU', name: 'Guam', dialCode: '+1671', flag: '🇬🇺', pattern: '^\\+1671[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'FM', name: 'Micronesia', dialCode: '+691', flag: '🇫🇲', pattern: '^\\+691[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'PW', name: 'Palau', dialCode: '+680', flag: '🇵🇼', pattern: '^\\+680[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'MH', name: 'Marshall Islands', dialCode: '+692', flag: '🇲🇭', pattern: '^\\+692[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'KI', name: 'Kiribati', dialCode: '+686', flag: '🇰🇮', pattern: '^\\+686[0-9]{8}$', placeholder: 'XXXX XXXX', maxLength: 8 },
  { code: 'NR', name: 'Nauru', dialCode: '+674', flag: '🇳🇷', pattern: '^\\+674[0-9]{7}$', placeholder: 'XXX XXXX', maxLength: 7 },
  { code: 'TV', name: 'Tuvalu', dialCode: '+688', flag: '🇹🇻', pattern: '^\\+688[0-9]{6}$', placeholder: 'XX XXXX', maxLength: 6 },
  { code: 'CK', name: 'Cook Islands', dialCode: '+682', flag: '🇨🇰', pattern: '^\\+682[0-9]{5}$', placeholder: 'XX XXX', maxLength: 5 },
  { code: 'NU', name: 'Niue', dialCode: '+683', flag: '🇳🇺', pattern: '^\\+683[0-9]{4}$', placeholder: 'XXXX', maxLength: 4 },
  { code: 'TK', name: 'Tokelau', dialCode: '+690', flag: '🇹🇰', pattern: '^\\+690[0-9]{4}$', placeholder: 'XXXX', maxLength: 4 },
];

// Get country by code
export function getCountryByCode(code: string): Country | undefined {
  return countries.find(c => c.code === code);
}

// Get country by dial code
export function getCountryByDialCode(dialCode: string): Country | undefined {
  return countries.find(c => c.dialCode === dialCode);
}

// Format phone number based on country
export function formatPhoneForCountry(phone: string, country: Country): string {
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');

  // For Australian numbers, strip leading 0 since +61 replaces it
  // This prevents users from accidentally entering 0412... when +61 is already selected
  if (country.code === 'AU' && digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  // Limit to max length
  const limited = digits.substring(0, country.maxLength);

  // Basic formatting - add spaces every 3-4 digits
  if (limited.length <= 3) return limited;
  if (limited.length <= 6) return `${limited.substring(0, 3)} ${limited.substring(3)}`;
  if (limited.length <= 9) return `${limited.substring(0, 3)} ${limited.substring(3, 6)} ${limited.substring(6)}`;
  return `${limited.substring(0, 3)} ${limited.substring(3, 6)} ${limited.substring(6, 10)} ${limited.substring(10)}`.trim();
}
