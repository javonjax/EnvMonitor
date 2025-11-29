import type { EnvMonitorData } from '@backend/types';
import HumidityCurrentValue from './HumidityCurrentValue';
import HumidityLineChart from './HumidityLineChart';

export interface HumidityContentProps {
  humidity: number | undefined;
  lineChartData: EnvMonitorData[];
}

const HumidityContent = ({ humidity, lineChartData }: HumidityContentProps) => {
  return (
    <div className="bg-test flex h-full w-full flex-col gap-4 rounded-xl p-4">
      <p>Environment Humidity</p>
      <div className="flex h-full w-full items-center">
        <HumidityCurrentValue humidity={humidity} />
        <HumidityLineChart lineChartData={lineChartData} />
      </div>
    </div>
  );
};

export default HumidityContent;
