import HumidityContent from './Humidity/HumidityContent';
import TemperatureContent from './Temperature/TemperatureContent';

export interface DHT11ContentProps {
  temperature: number | undefined;
  humidity: number | undefined;
}

const DHT11Content = ({ temperature, humidity }: DHT11ContentProps) => {
  return (
    <div className="col-span-full row-span-4 flex flex-col items-center border-2 border-red-500 lg:col-span-3">
      <TemperatureContent temperature={temperature} />
      <HumidityContent humidity={humidity} />
    </div>
  );
};

export default DHT11Content;
