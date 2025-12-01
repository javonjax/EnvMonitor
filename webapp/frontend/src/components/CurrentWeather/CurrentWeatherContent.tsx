import { useEffect, useState } from 'react';
import CurrentWeather from './CurrentWeather';
import type { CurrentWeatherAPIResponse } from '@backend/types';
import CurrentWeatherOverview from './CurrentWeatherOverview';

const BACKEND_CURRENT_WEATHER_URL: string = import.meta.env
  .VITE_BACKEND_CURRENT_WEATHER_URL as string;

const CurrentWeatherContent = () => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherAPIResponse>();

  useEffect(() => {
    const fetchCurrentWeather = async (): Promise<void> => {
      try {
        const url: string = BACKEND_CURRENT_WEATHER_URL;
        const res: globalThis.Response = await fetch(url);
        const currentWeatherData: CurrentWeatherAPIResponse = await res.json();
        setCurrentWeather(currentWeatherData);
      } catch (error) {
        // TODO: frontend error handling
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    };

    fetchCurrentWeather();
    // TODO: turn this off if not needed
    // const interval = setInterval(() => {
    //   fetchCurrentWeather();
    // }, 600000);

    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-span-full row-span-2 p-4 lg:col-span-6">
      <div className="flex h-full w-full flex-col gap-8 lg:flex-row">
        <CurrentWeather currentWeather={currentWeather} />
        <CurrentWeatherOverview weatherOverview={currentWeather?.weatherOverview} />
      </div>
    </div>
  );
};

export default CurrentWeatherContent;
