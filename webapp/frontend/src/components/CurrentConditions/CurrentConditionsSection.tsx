import type { CurrentWeatherAPIResponse } from '@backend/types';
import { useState, useEffect } from 'react';
import CurrentDateTime from './CurrentDateTime';
import CurrentWeather from './CurrentWeather';
import WeatherOverview from './WeatherOverview';

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
    <section className="bg-background col-span-full row-span-1 m-4 rounded-xl p-4 xl:col-span-6">
      <div className="flex h-full gap-x-4">
        <div className="flex h-full w-[50%] flex-col gap-y-6">
          <CurrentDateTime currentDateTime={currentDateTime} />
          <CurrentWeather currentWeather={currentWeather} />
        </div>
        <div className="flex h-full w-[50%]">
          <WeatherOverview weatherOverview={currentWeather?.weatherOverview} />
        </div>
      </div>
    </section>
  );
};

export default CurrentConditionsSection;
