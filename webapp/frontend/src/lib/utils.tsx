import { clsx, type ClassValue } from 'clsx';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  Cloudy,
  Snowflake,
  Sun,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets the appropriate icon for the given weather description.
 *
 * @param description Description of weather conditions.
 * @returns Weather icon.
 */
export const getForecastIcon = (description: string, size: number): React.JSX.Element => {
  if (description.includes('thunderstorm')) {
    return <CloudLightning size={size} />;
  } else if (description.includes('drizzle')) {
    return <CloudDrizzle size={size} />;
  } else if (description.includes('rain')) {
    return <CloudRain size={size} />;
  } else if (description.includes('snow')) {
    return <Snowflake size={size} />;
  } else if (description.includes('overcast')) {
    return <Cloudy size={size} />;
  } else if (description.includes('clouds')) {
    return <Cloud size={size} />;
  } else if (
    description.includes('mist') ||
    description.includes('smoke') ||
    description.includes('haze') ||
    description.includes('sand') ||
    description.includes('dust') ||
    description.includes('ash') ||
    description.includes('squall')
  ) {
    return <CloudFog size={size} />;
  } else {
    return <Sun size={size} />;
  }
};
