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
import { toast } from 'sonner';
import type { ReactNode } from 'react';

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

/**
 *
 * @param angle
 * @returns Direction as a string. [N,]
 */
export const angleToDirectionString = (angle: number): string => {
  const directions: string[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx: number = Math.round(angle / 45) % 8;
  return directions[idx];
};

/*
  Custom frontend error class.
*/
export class APIError extends Error {
  public status: number;
  constructor(message: string = 'Error communicating with backend API.', status: number = 500) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

/*
  Handle API fetches and create error object if necessary.
*/
export const handleAPIFetch = async (res: globalThis.Response): Promise<globalThis.Response> => {
  if (!res.ok) {
    const body = await res.json();
    const message: string = body?.message || 'API fetch error.';
    const status: number = body?.status ?? res.status;
    throw new APIError(message, status);
  }
  return res;
};

/*
  Handle errors thrown by frontend API fetches.
*/
export const handleAPIError = (error: unknown): void => {
  let toastDescription: string = '';
  if (error instanceof APIError) {
    toastDescription = error.message;
  } else {
    console.warn(`API fetch error.`);
    toastDescription = 'There was an issue connecting to the servers.';
  }
  warningToast('Uh-oh.', toastDescription);
};

export const successToast = (
  message: string = 'Success.',
  description: string | ReactNode
): void => {
  toast.success(message, {
    position: 'top-center',
    duration: 7000,
    description: description,
  });
};

export const warningToast = (message: string = 'Uh-oh.', description: string | ReactNode): void => {
  toast.warning(message, {
    position: 'top-center',
    duration: 7000,
    description: description,
  });
};

export const errorToast = (
  message: string = 'Error.',
  description: string | ReactNode = 'An error has occured.'
): void => {
  toast.error(message, {
    position: 'top-center',
    duration: 7000,
    description: description,
  });
};
