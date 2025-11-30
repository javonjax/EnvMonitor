import { getForecastIcon } from '@/lib/utils';
import type { DailyForecastDay } from '@backend/types';

export interface WeatherForecastCardProps {
  forecastDay: DailyForecastDay | undefined;
}

const WeatherForecastCard = ({ forecastDay }: WeatherForecastCardProps) => {
  return (
    <div className="bg-test flex flex-col justify-center gap-y-2 rounded-xl p-4">
      {forecastDay && (
        <p>{new Date(forecastDay.dt).toLocaleString('en-US', { weekday: 'long' })}</p>
      )}
      <div className="flex gap-x-4">
        <p>{forecastDay?.temp + '°F'}</p>
        {forecastDay ? getForecastIcon(forecastDay.weatherDescription) : ''}
      </div>
      <div className="flex w-full gap-x-2">
        <p className="text-[12px] text-nowrap">L: {forecastDay?.tempMin + '°F'}</p>
        <p className="text-[12px] text-nowrap">H: {forecastDay?.tempMax + '°F'}</p>
      </div>
    </div>
  );
};

export default WeatherForecastCard;
