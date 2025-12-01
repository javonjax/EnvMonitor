import { getForecastIcon } from '@/lib/utils';
import { SatelliteDish } from 'lucide-react';

export interface CurrentWeatherProps {
  timestamp: number | undefined;
  feelsLike: number | undefined;
  temp: number | undefined;
  humidity: number | undefined;
  weatherDescription: string | undefined;
  weatherIcon: string | undefined;
  weatherOverview: string | undefined;
}

const CurrentWeather = ({ feelsLike, humidity, temp, weatherDescription }: CurrentWeatherProps) => {
  return (
    <div className="bg-accent flex h-full w-full flex-col items-center justify-center gap-y-4 rounded-xl p-4 lg:w-[50%]">
      <div className="flex w-full items-center gap-x-2">
        <SatelliteDish size={36} />
        <p className="w-full text-2xl font-semibold">Current Weather</p>
      </div>
      <div className="bg-test flex h-full max-h-[250px] w-full flex-col gap-y-4 rounded-xl border-2 p-4">
        <div className="flex w-full grow items-center justify-center">
          <div className="flex h-full w-full flex-col">
            <p>Temperature: {temp + '°F'}</p>
            <p>Feels like: {feelsLike + '°F'}</p>
            <p>Humidity: {humidity + '%'}</p>
          </div>
          <div className="flex h-full w-full flex-col items-center justify-center">
            {weatherDescription ? getForecastIcon(weatherDescription, 96) : ''}
            <p>{weatherDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
