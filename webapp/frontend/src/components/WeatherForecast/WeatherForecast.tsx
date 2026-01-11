import type { DailyForecasetAPIResponse, DailyForecastDay } from '@backend/types';
import WeatherForecastCard from './WeatherForecastCard';
import LoadingSpinner from '../ui/Custom/LoadingSpinner';

export interface WeatherForecastProps {
  weatherForecast: DailyForecasetAPIResponse | undefined;
}

const WeatherForecast = ({ weatherForecast }: WeatherForecastProps) => {
  return (
    <div className="flex w-full grow items-center justify-evenly gap-x-4 overflow-x-auto py-4">
      {!weatherForecast && <LoadingSpinner />}
      {weatherForecast &&
        weatherForecast.length > 0 &&
        weatherForecast
          .slice(1)
          .map((forecastDay: DailyForecastDay) => (
            <WeatherForecastCard key={forecastDay.dt} forecastDay={forecastDay} />
          ))}
    </div>
  );
};

export default WeatherForecast;
