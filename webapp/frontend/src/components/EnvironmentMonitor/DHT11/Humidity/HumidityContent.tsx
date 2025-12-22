import type { EnvMonitorData } from '@backend/types';
import HumidityCurrentValue from './HumidityCurrentValue';
import HumidityLineChart from './HumidityLineChart';
import LoadingSpinner from '@/components/ui/Custom/LoadingSpinner';

export interface HumidityContentProps {
  humidity: number | undefined;
  lineChartData: EnvMonitorData[];
}

const HumidityContent = ({ humidity, lineChartData }: HumidityContentProps) => {
  return (
    <div className="bg-accent flex h-full w-full grow flex-col gap-4 rounded-xl p-4 xl:w-[40%]">
      <p className="text-xl">Humidity</p>
      <div className="flex h-full w-full items-center gap-x-2 xl:min-h-[360px]">
        {!(humidity && lineChartData) && <LoadingSpinner />}
        {humidity && lineChartData && (
          <>
            <HumidityCurrentValue humidity={humidity} />
            <HumidityLineChart lineChartData={lineChartData} />
          </>
        )}
      </div>
    </div>
  );
};

export default HumidityContent;
