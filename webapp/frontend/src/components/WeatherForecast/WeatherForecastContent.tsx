import { useState, useEffect } from 'react';
import type { DailyForecasetAPIResponse } from '@backend/types';
import WeatherForecast from './WeatherForecast';

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
    <div className="col-span-full row-span-2 p-4 lg:col-span-3">
      <WeatherForecast weatherForecast={weatherForecast} />
    </div>
  );
};

export default WeatherForecastContent;
