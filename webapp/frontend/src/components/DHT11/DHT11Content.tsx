import { useEffect, useState } from 'react';
import type { EnvMonitorData } from '../../../../backend/src/types';
import HumidityContent from './Humidity/HumidityContent';
import TemperatureContent from './Temperature/TemperatureContent';
import { Wifi } from 'lucide-react';

const BACKED_DATA_24HR_URL: string = import.meta.env.VITE_BACKEND_DATA_24HR_URL as string;

export interface DHT11ContentProps {
  temperature: number | undefined;
  humidity: number | undefined;
}

const DHT11Content = ({ temperature, humidity }: DHT11ContentProps) => {
  const [lineChartData, setLineChartData] = useState<EnvMonitorData[]>([]);

  // Fetch initial line chart data.
  useEffect(() => {
    const fetchLineChartData = async (): Promise<void> => {
      try {
        const url: string = `${BACKED_DATA_24HR_URL}1`;
        const res: globalThis.Response = await fetch(url);
        const data = await res.json();
        console.log(data);
        setLineChartData(data);
      } catch (error) {
        if (error instanceof Error) {
          //TODO: frontend error handling eg simple toast
          console.log(error.message);
        }
      }
    };

    fetchLineChartData();
  }, []);

  return (
    <div className="col-span-full row-span-2 p-4 lg:col-span-6">
      <div className="bg-background flex h-full w-full flex-col gap-y-4 rounded-xl p-4">
        <div className="flex w-full items-center gap-x-2">
          <Wifi size={32} />
          <p className="w-full text-2xl font-semibold">ESP32 DHT11</p>
        </div>

        <div className="flex h-full w-full flex-col items-center gap-y-4">
          <TemperatureContent temperature={temperature} lineChartData={lineChartData} />
          <HumidityContent humidity={humidity} lineChartData={lineChartData} />
        </div>
      </div>
    </div>
  );
};

export default DHT11Content;
