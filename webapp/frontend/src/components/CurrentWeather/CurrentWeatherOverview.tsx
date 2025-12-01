import { Sparkles } from 'lucide-react';
import LoadingSpinner from '../ui/Custom/LoadingSpinner';

export interface CurrentWeatherOverviewProps {
  weatherOverview: string | undefined;
}
const CurrentWeatherOverview = ({ weatherOverview }: CurrentWeatherOverviewProps) => {
  return (
    <div className="bg-accent flex h-full w-full flex-col items-center justify-center gap-y-4 rounded-xl p-4 lg:w-[50%]">
      <div className="flex w-full items-center gap-x-2">
        <Sparkles size={32} />
        <p className="w-full text-2xl font-semibold">AI Weather Overview</p>
      </div>
      <div className="bg-test flex h-full max-h-[250px] min-h-0 w-full rounded-xl p-4">
        {!weatherOverview && <LoadingSpinner />}
        {weatherOverview && <p className="overflow-y-auto text-[14px]">{weatherOverview}</p>}
      </div>
    </div>
  );
};

export default CurrentWeatherOverview;
