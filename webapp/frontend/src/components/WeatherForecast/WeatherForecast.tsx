import type { DailyForecasetAPIResponse } from '@backend/types';
import WeatherForecastCard from './WeatherForecastCard';

export interface WeatherForecastProps {
  weatherForecast: DailyForecasetAPIResponse | undefined;
}

const WeatherForecast = ({ weatherForecast }: WeatherForecastProps) => {
  return (
    <div className="bg-accent flex h-full w-full flex-col rounded-xl p-4">
      <p className="w-full">7-Day Weather Forecast</p>
      <div className="flex w-full grow items-center justify-evenly gap-x-4 overflow-x-auto">
        {weatherForecast?.slice(1).map((forecastDay) => (
          <WeatherForecastCard key={forecastDay.dt} forecastDay={forecastDay} />
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
