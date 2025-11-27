import type { EnvMonitorData } from '@backend/types';
import TemperatureCurrentValue from './TemperatureCurrentValue';
import TemperatureLineChart from './TemperatureLineChart';

export interface TemperatureContentProps {
  temperature: number | undefined;
  lineChartData: EnvMonitorData[];
}

const TemperatureContent = ({ temperature, lineChartData }: TemperatureContentProps) => {
  return (
    <div className="flex h-full w-full items-center gap-4 border-2 border-blue-500 p-4">
      <TemperatureCurrentValue temperature={temperature} />
      <TemperatureLineChart lineChartData={lineChartData} />
    </div>
  );
};

export default TemperatureContent;
