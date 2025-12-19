import { useState, useEffect } from 'react';
import type { DailyForecasetAPIResponse } from '@backend/types';
import WeatherForecast from './WeatherForecast';
import { CalendarDays } from 'lucide-react';

const BACKEND_WEATHER_FORECAST_URL = import.meta.env.VITE_BACKEND_WEATHER_FORECAST_URL as string;

const WeatherForecastContent = () => {
  const [weatherForecast, setWeatherForecast] = useState<DailyForecasetAPIResponse>();

  useEffect(() => {
    const fetchWeatherForecast = async (): Promise<void> => {
      try {
        const url: string = BACKEND_WEATHER_FORECAST_URL;
        const res: globalThis.Response = await fetch(url);
        const weatherForecastData: DailyForecasetAPIResponse = await res.json();
        setWeatherForecast(weatherForecastData);
      } catch (error) {
        // TODO: frontend error handling
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    };

    fetchWeatherForecast();

    const interval = setInterval(() => {
      fetchWeatherForecast();
    }, 600000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="col-span-full row-span-1 p-4 lg:col-span-6">
      <div className="bg-background flex h-full w-full flex-col rounded-xl p-4">
        <div className="flex w-full items-center gap-x-2">
          <CalendarDays size={32} />
          <p className="w-full text-2xl font-semibold">7-Day Weather Forecast</p>
        </div>

        <WeatherForecast weatherForecast={weatherForecast} />
      </div>
    </div>
  );
};

export default WeatherForecastContent;
