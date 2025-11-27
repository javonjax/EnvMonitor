import { useEffect, useState } from 'react';
import CurrentWeather from './CurrentWeather';
import type { CurrentWeatherAPIResponse } from '@backend/types';

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
    // TODO: turn this back on when needed
    // const interval = setInterval(() => {
    //   fetchCurrentWeather();
    // }, 600000);

    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-span-full row-span-2 flex min-h-[400px] flex-col items-center justify-evenly border-2 border-yellow-500 p-4 lg:col-span-3 lg:min-h-0">
      <CurrentWeather
        feelsLike={currentWeather?.feelsLike}
        humidity={currentWeather?.humidity}
        temp={currentWeather?.temp}
        timestamp={currentWeather?.dt}
        weatherDescription={currentWeather?.weatherDescription}
        weatherIcon={currentWeather?.weatherIcon}
        weatherOverview={currentWeather?.weatherOverview}
      />
    </div>
  );
};

export default CurrentWeatherContent;
