import type { CurrentWeatherAPIResponse } from '@backend/types';
import LoadingSpinner from '../ui/Custom/LoadingSpinner';
import { getForecastIcon } from '@/lib/utils';
import { SatelliteDish } from 'lucide-react';

export interface CurrentWeatherProps {
  currentWeather: CurrentWeatherAPIResponse | undefined;
}

const CurrentWeather = ({ currentWeather }: CurrentWeatherProps) => {
  const {
    temp,
    feelsLike,
    humidity,
    weatherDescription,
    sunrise,
    sunset,
    windSpeed,
    tempMin,
    tempMax,
  } = currentWeather ?? {};
  return (
    <div className="flex w-full grow flex-col gap-y-2">
      <div className="flex w-full items-center gap-x-2">
        <SatelliteDish size={36} />
        <p className="w-full text-2xl font-semibold">Current Weather</p>
      </div>
      {!currentWeather && <LoadingSpinner />}
      {currentWeather && (
        <div className="bg-accent flex w-full grow items-center rounded-xl p-4">
          <div className="flex h-full flex-col justify-center gap-y-2">
            <p className="text-4xl font-semibold">{temp + '°F'}</p>
            <p>Feels like: {feelsLike + '°F'}</p>
            <div className="flex gap-x-2">
              <p>H: {tempMax + '°F'}</p>
              <p>L: {tempMin + '°F'}</p>
            </div>
            <p>Humidity: {humidity + '%'}</p>
          </div>
          <div className="flex grow items-center justify-center">
            <div className="flex flex-col">
              <div className="flex items-center justify-center">
                {getForecastIcon(String(weatherDescription), 84)}
              </div>
              <p className="text-center capitalize">{weatherDescription}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentWeather;
