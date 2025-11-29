import type { EnvMonitorData } from '@backend/types';
import TemperatureCurrentValue from './TemperatureCurrentValue';
import TemperatureLineChart from './TemperatureLineChart';

export interface TemperatureContentProps {
  temperature: number | undefined;
  lineChartData: EnvMonitorData[];
}

const TemperatureContent = ({ temperature, lineChartData }: TemperatureContentProps) => {
  return (
    <div className="bg-test flex h-full w-full flex-col gap-4 rounded-xl p-4">
      <p>Environment Temperature</p>
      <div className="flex h-full w-full items-center">
        <TemperatureCurrentValue temperature={temperature} />
        <TemperatureLineChart lineChartData={lineChartData} />
      </div>
    </div>
  );
};

export default TemperatureContent;
