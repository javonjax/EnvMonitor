import { useEffect, useState } from 'react';
import type { EnvMonitorData } from '../../../../backend/src/types';
import HumidityContent from './Humidity/HumidityContent';
import TemperatureContent from './Temperature/TemperatureContent';

const BACKED_DATA_24HR_URL: string = import.meta.env.VITE_BACKEND_DATA_24HR_URL as string;

export interface DHT11ContentProps {
  temperature: number | undefined;
  humidity: number | undefined;
}

const DHT11Content = ({ temperature, humidity }: DHT11ContentProps) => {
  const [lineChartData, setLineChartData] = useState<EnvMonitorData[]>([]);

  // Fetch initial line chart data.
  useEffect(() => {
    const fetchInitialData = async (): Promise<void> => {
      const url: string = `${BACKED_DATA_24HR_URL}1`;
      const res: globalThis.Response = await fetch(url);
      const data = await res.json();
      console.log(data);
      setLineChartData(data);
    };

    fetchInitialData();
  }, []);

  return (
    <div className="col-span-full row-span-4 flex flex-col items-center border-2 border-red-500 lg:col-span-3">
      <TemperatureContent temperature={temperature} lineChartData={lineChartData} />
      <HumidityContent humidity={humidity} lineChartData={lineChartData} />
    </div>
  );
};

export default DHT11Content;
