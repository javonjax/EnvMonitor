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
    <div className="bg-accent flex h-full w-full flex-col gap-y-4 rounded-xl p-4">
      <p className="w-full">Current weather</p>
      <div className="flex h-full w-full grow flex-col">
        <p>Temperature: {temp?.toFixed(2) + '°F'}</p>
        <p>Feels like: {feelsLike?.toFixed(2) + '°F'}</p>
        <p>Humidity: {humidity + '%'}</p>
        {/* TODO: get better icons */}
        {/* <img
        src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
        alt={weatherDescription}
      /> */}
        {/* <p className="text-[12px]">{weatherOverview}</p> */}
      </div>
      {/* <p>Last Update: {new Date(Number(timestamp)).toLocaleString()}</p> */}
    </div>
  );
};

export default CurrentWeather;
