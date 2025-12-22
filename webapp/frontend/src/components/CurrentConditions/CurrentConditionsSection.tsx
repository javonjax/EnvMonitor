import type { CurrentWeatherAPIResponse } from '@backend/types';
import { useState, useEffect } from 'react';
import CurrentDateTime from './CurrentDateTime';
import CurrentWeather from './CurrentWeather';
import WeatherOverview from './WeatherOverview';
import { errorToast, handleAPIError, handleAPIFetch, warningToast } from '@/lib/utils';

export interface CurrentConditionsContentProps {
  currentDateTime: Date;
}

const BACKEND_CURRENT_WEATHER_URL: string = import.meta.env
  .VITE_BACKEND_CURRENT_WEATHER_URL as string;

const CurrentConditionsSection = ({ currentDateTime }: CurrentConditionsContentProps) => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherAPIResponse>();

  useEffect(() => {
    const fetchCurrentWeather = async (): Promise<void> => {
      try {
        const url: string = BACKEND_CURRENT_WEATHER_URL;
        const res: globalThis.Response = await handleAPIFetch(await fetch(url));
        const currentWeatherData: CurrentWeatherAPIResponse = await res.json();
        setCurrentWeather(currentWeatherData);
      } catch (error) {
        if (error instanceof Error) {
          handleAPIError(error);
        } else {
          errorToast();
        }
      }
    };

    fetchCurrentWeather();

    // TODO: turn this off if not needed durign testing
    const interval = setInterval(() => {
      fetchCurrentWeather();
    }, 600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-background col-span-full row-span-1 m-4 rounded-xl p-4 xl:col-span-6">
      <div className="flex h-full flex-col gap-4 sm:flex-row">
        <div className="flex h-full w-full flex-col gap-y-6 sm:w-[50%]">
          <CurrentDateTime currentDateTime={currentDateTime} />
          <CurrentWeather currentWeather={currentWeather} />
        </div>
        <div className="flex h-full w-full sm:w-[50%]">
          <WeatherOverview weatherOverview={currentWeather?.weatherOverview} />
        </div>
      </div>
    </section>
  );
};

export default CurrentConditionsSection;
