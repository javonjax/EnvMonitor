import type { CurrentWeatherAPIResponse } from '@/lib/types';
import LoadingSpinner from '../ui/Custom/LoadingSpinner';
import { angleToDirectionString, getForecastIcon } from '@/lib/utils';
import { SatelliteDish } from 'lucide-react';

export interface CurrentWeatherProps {
  currentWeather: CurrentWeatherAPIResponse | undefined;
}

const CurrentWeather = ({ currentWeather }: CurrentWeatherProps) => {
  return (
    <div className="flex w-full grow flex-col gap-y-2">
      <div className="flex w-full items-center gap-x-2">
        <SatelliteDish size={36} />
        <p className="w-full text-3xl font-semibold">Current Weather</p>
      </div>
      {!currentWeather && <LoadingSpinner />}
      {currentWeather && (
        <div className="bg-accent flex w-full grow flex-col justify-center gap-4 rounded-xl p-4">
          <div className="flex w-full grow gap-y-2">
            <div className="flex h-full w-[50%] flex-col justify-center gap-y-2">
              <p className="text-3xl">{currentWeather.temp + '°F'}</p>
              <p>Feels like: {currentWeather.feelsLike + '°F'}</p>
              <div className="flex gap-x-2">
                <p className="text-nowrap">L: {currentWeather.tempMin + '°F'}</p>
                <p className="text-nowrap">H: {currentWeather.tempMax + '°F'}</p>
              </div>
              <p>Humidity: {currentWeather.humidity + '%'}</p>
              <p>
                Wind: {currentWeather.windSpeed + ' MPH,'}{' '}
                {angleToDirectionString(currentWeather.windDirection)}
              </p>
            </div>
            <div className="flex w-[50%] grow items-center justify-center">
              <div className="flex flex-col">
                <div className="flex items-center justify-center">
                  {getForecastIcon(String(currentWeather.weatherDescription), 96)}
                </div>
                <p className="text-center text-[20px] capitalize">
                  {currentWeather.weatherDescription}
                </p>
              </div>
            </div>
          </div>
          <p className="w-full text-center">
            Last update: {new Date(Number(currentWeather.timestamp)).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrentWeather;
