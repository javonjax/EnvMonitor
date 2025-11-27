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
    <div className="flex h-full w-full flex-col items-center rounded-xl border-2 border-black p-4">
      <p>{temp?.toFixed(2) + '°F'}</p>
      <p>{feelsLike?.toFixed(2) + '°F'}</p>
      <p>{humidity + '%'}</p>
      {/* TODO: get better icons */}
      {/* <img
        src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
        alt={weatherDescription}
      /> */}
      <p className="text-[12px]">{weatherOverview}</p>
      <p>Last Update: {new Date(Number(timestamp)).toLocaleString()}</p>
    </div>
  );
};

export default CurrentWeather;
