import { getForecastIcon } from '@/lib/utils';

export interface CurrentWeatherProps {
  timestamp: number | undefined;
  feelsLike: number | undefined;
  temp: number | undefined;
  humidity: number | undefined;
  weatherDescription: string | undefined;
  weatherIcon: string | undefined;
  weatherOverview: string | undefined;
}

const CurrentWeather = ({
  timestamp,
  feelsLike,
  humidity,
  temp,
  weatherDescription,
  weatherIcon,
  weatherOverview,
}: CurrentWeatherProps) => {
  return (
    <div className="bg-test flex h-full max-h-[250px] w-full flex-col gap-y-4 rounded-xl p-4">
      <p className="w-full">Current Weather Prediction</p>
      <div className="flex w-full grow items-center justify-center">
        <div className="flex h-full w-full grow flex-col">
          <p>Temperature: {temp + '°F'}</p>
          <p>Feels like: {feelsLike + '°F'}</p>
          <p>Humidity: {humidity + '%'}</p>
        </div>
        {weatherDescription ? getForecastIcon(weatherDescription) : ''}
        <p>{weatherDescription}</p>
      </div>
      {/* <p>Last Update: {new Date(Number(timestamp)).toLocaleString()}</p> */}
    </div>
  );
};

export default CurrentWeather;
