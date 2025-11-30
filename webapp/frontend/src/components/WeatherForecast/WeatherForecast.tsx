import type { DailyForecasetAPIResponse } from '@backend/types';
import WeatherForecastCard from './WeatherForecastCard';

export interface WeatherForecastProps {
  weatherForecast: DailyForecasetAPIResponse | undefined;
}

const WeatherForecast = ({ weatherForecast }: WeatherForecastProps) => {
  return (
    <div className="flex w-full grow items-center justify-evenly gap-x-4 overflow-x-auto">
      {weatherForecast?.slice(1).map((forecastDay) => (
        <WeatherForecastCard key={forecastDay.dt} forecastDay={forecastDay} />
      ))}
    </div>
  );
};

export default WeatherForecast;
