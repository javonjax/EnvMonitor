import { getForecastIcon } from '@/lib/utils';
import { SatelliteDish } from 'lucide-react';
import LoadingSpinner from '../ui/Custom/LoadingSpinner';
import type { CurrentWeatherAPIResponse } from '@backend/types';

export interface CurrentWeatherProps {
  currentWeather: CurrentWeatherAPIResponse | undefined;
}

const CurrentWeather = ({ currentWeather }: CurrentWeatherProps) => {
  const { temp, feelsLike, humidity, weatherDescription, sunrise, sunset, windSpeed } =
    currentWeather ?? {};

  return (
    <div className="bg-background flex h-full w-full flex-col items-center justify-center gap-y-4 rounded-xl p-4 lg:w-[50%]">
      <div className="flex w-full items-center gap-x-2">
        <SatelliteDish size={36} />
        <p className="w-full text-2xl font-semibold">Current Weather</p>
      </div>
      <div className="bg-accent flex h-full w-full flex-col gap-y-4 rounded-xl p-4">
        {!currentWeather && <LoadingSpinner />}
        {currentWeather && (
          <div className="flex h-full w-full flex-row-reverse items-center justify-center lg:flex-col">
            <div className="flex h-[50%] w-full flex-col items-center justify-evenly">
              {getForecastIcon(String(weatherDescription), 72)}
              <p className="capitalize">{weatherDescription}</p>
            </div>

            <div className="flex w-full flex-col flex-wrap items-start gap-4 lg:h-full 2xl:h-[50%]">
              <p className="text-nowrap">Temperature: {temp + '°F'}</p>
              <p className="text-nowrap">Feels Like: {feelsLike + '°F'}</p>
              <p className="text-nowrap">Humidity: {humidity + '%'}</p>
              <p className="text-nowrap">
                Sunrise:{' '}
                {new Date(Number(sunrise)).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </p>
              <p className="text-nowrap">
                Sunset:{' '}
                {new Date(Number(sunset)).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </p>
              <p>Wind: {windSpeed + ' MPH'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentWeather;
