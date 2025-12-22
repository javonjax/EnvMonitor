import { getForecastIcon } from '@/lib/utils';
import type { DailyForecastDay } from '@backend/types';

export interface WeatherForecastCardProps {
  forecastDay: DailyForecastDay;
}

const WeatherForecastCard = ({ forecastDay }: WeatherForecastCardProps) => {
  return (
    <div className="bg-accent flex h-[220px] w-[250px] shrink-0 items-center justify-center gap-y-2 rounded-xl p-4 xl:h-[50%] xl:min-h-[180px]">
      <div className="flex w-[60%] flex-col">
        <p className="text-xl">
          {new Date(forecastDay.dt).toLocaleString('en-US', { weekday: 'long' })}
        </p>

        <div className="flex items-center gap-x-4">
          <p>{forecastDay.temp + '°F'}</p>

          {/* {getForecastIcon(forecastDay.weatherDescription, 36)} */}
        </div>
        <div className="flex w-full gap-x-2">
          <p className="text-nowrap">L: {forecastDay.tempMin + '°F'}</p>
          <p className="text-nowrap">H: {forecastDay.tempMax + '°F'}</p>
        </div>
      </div>
      <div className="flex w-[40%] flex-col items-center justify-center">
        {getForecastIcon(forecastDay.weatherDescription, 48)}
        <p className="text-center text-[16px] capitalize">{forecastDay.weatherDescription}</p>
      </div>
    </div>
  );
};

export default WeatherForecastCard;
