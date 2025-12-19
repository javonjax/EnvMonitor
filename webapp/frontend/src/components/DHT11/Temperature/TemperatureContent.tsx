import type { EnvMonitorData } from '@backend/types';
import TemperatureCurrentValue from './TemperatureCurrentValue';
import TemperatureLineChart from './TemperatureLineChart';
import LoadingSpinner from '@/components/ui/Custom/LoadingSpinner';

export interface TemperatureContentProps {
  temperature: number | undefined;
  lineChartData: EnvMonitorData[];
}

const TemperatureContent = ({ temperature, lineChartData }: TemperatureContentProps) => {
  return (
    <div className="bg-accent max-h-[250px flex h-full w-full flex-col gap-4 rounded-xl p-4">
      <p className="text-xl">Temperature</p>
      <div className="flex h-full w-full items-center gap-x-1">
        {!(temperature && lineChartData) && <LoadingSpinner />}
        {temperature && lineChartData && (
          <>
            <TemperatureCurrentValue temperature={temperature} />
            <TemperatureLineChart lineChartData={lineChartData} />
          </>
        )}
      </div>
    </div>
  );
};

export default TemperatureContent;
