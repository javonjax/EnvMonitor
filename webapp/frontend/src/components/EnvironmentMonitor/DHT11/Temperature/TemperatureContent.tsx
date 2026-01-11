import type { EnvMonitorData } from '@/lib/types';
import TemperatureCurrentValue from './TemperatureCurrentValue';
import TemperatureLineChart from './TemperatureLineChart';
import LoadingSpinner from '@/components/ui/Custom/LoadingSpinner';

export interface TemperatureContentProps {
  temperature: number | undefined;
  lineChartData: EnvMonitorData[];
}

const TemperatureContent = ({ temperature, lineChartData }: TemperatureContentProps) => {
  return (
    <div className="bg-accent flex h-full w-full grow flex-col gap-4 rounded-xl p-4 xl:w-[40%]">
      <p className="text-2xl">Temperature</p>
      <div className="flex h-full w-full items-center gap-x-1 xl:min-h-[360px]">
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
