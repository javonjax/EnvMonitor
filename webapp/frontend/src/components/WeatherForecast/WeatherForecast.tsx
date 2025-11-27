import type { DailyForecasetAPIResponse } from '@backend/types';

export interface WeatherForecastProps {
  weatherForecast: DailyForecasetAPIResponse | undefined;
}

const WeatherForecast = ({ weatherForecast }: WeatherForecastProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center rounded-xl border-2 border-black p-4">
      {weatherForecast?.map((item) => (
        <p>{item.temp.max}</p>
      ))}
    </div>
  );
};

export default WeatherForecast;
