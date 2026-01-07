import { Sparkles } from 'lucide-react';
import LoadingSpinner from '../ui/Custom/LoadingSpinner';

export interface WeatherOverviewProps {
  weatherOverview: string | undefined;
}

const WeatherOverview = ({ weatherOverview }: WeatherOverviewProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-4">
      <div className="flex w-full items-center gap-x-2">
        <Sparkles size={32} />
        <p className="w-full text-3xl font-semibold">AI Weather Overview</p>
      </div>
      <div className="bg-accent flex w-full grow items-center justify-center rounded-xl p-4">
        {!weatherOverview && <LoadingSpinner />}
        {weatherOverview && <p className="max-h-[300px] overflow-y-auto">{weatherOverview}</p>}
      </div>
    </div>
  );
};

export default WeatherOverview;
