import { useEffect, useState } from 'react';
import type { EnvMonitorData } from '../../../../backend/src/types';
import HumidityContent from './DHT11/Humidity/HumidityContent';
import TemperatureContent from './DHT11/Temperature/TemperatureContent';
import { Wifi } from 'lucide-react';
import WaterLevel from './WaterLevel/WaterLevel';
import { errorToast, handleAPIError, handleAPIFetch } from '@/lib/utils';

const BACKEND_DATA_RECENT_URL: string = import.meta.env.VITE_BACKEND_DATA_RECENT_URL as string;

export interface EnvironmentMonitorSectionProps {
  websocketData: EnvMonitorData | undefined;
  // temperature: number | undefined;
  // humidity: number | undefined;
  // waterLevel: string | undefined;
  // timestamp: number | undefined;
}

const EnvironmentMonitorSection = ({ websocketData }: EnvironmentMonitorSectionProps) => {
  const [lineChartData, setLineChartData] = useState<EnvMonitorData[]>([]);

  // Fetch initial line chart data.
  useEffect(() => {
    const fetchLineChartData = async (): Promise<void> => {
      try {
        const url: string = `${BACKEND_DATA_RECENT_URL}1`;
        const res: globalThis.Response = await handleAPIFetch(await fetch(url));
        const data = await res.json();
        console.log(data);
        setLineChartData(data);
      } catch (error) {
        if (error instanceof Error) {
          handleAPIError(error);
        } else {
          errorToast();
        }
      }
    };
    fetchLineChartData();
  }, []);

  // Update line chart data.
  useEffect(() => {
    if (websocketData) {
      setLineChartData((prev) => {
        return [...prev, websocketData];
      });
    }
  }, [websocketData]);

  return (
    <section className="col-span-full row-span-1 p-4">
      <div className="bg-background flex h-full w-full flex-col gap-y-4 rounded-xl p-4">
        <div className="flex w-full items-center gap-x-2">
          <Wifi size={32} />
          <p className="w-full text-2xl font-semibold">ESP32 Environment Monitor</p>
        </div>

        <div className="flex h-full w-full flex-col items-center gap-4 xl:flex-row">
          <TemperatureContent
            temperature={websocketData?.temperature}
            lineChartData={lineChartData}
          />
          <HumidityContent humidity={websocketData?.humidity} lineChartData={lineChartData} />
          <WaterLevel waterLevel={websocketData?.waterLevel} />
        </div>
        {websocketData && (
          <p className="w-full text-center">
            Last update: {new Date(websocketData.timestamp).toLocaleString()}
          </p>
        )}
        {!websocketData && lineChartData.length > 0 && (
          <p className="w-full text-center">
            Last update:{' '}
            {new Date(lineChartData[lineChartData.length - 1].timestamp).toLocaleString()}
          </p>
        )}
      </div>
    </section>
  );
};

export default EnvironmentMonitorSection;
