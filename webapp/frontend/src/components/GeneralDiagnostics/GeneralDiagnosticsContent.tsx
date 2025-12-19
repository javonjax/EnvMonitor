import WaterLevel from './WaterLevel';

import LastFeedTime from './LastFeedTime';
import { Wifi } from 'lucide-react';
import LoadingSpinner from '../ui/Custom/LoadingSpinner';

export interface GeneralDiagnosticsContentProps {
  waterLevel: string | undefined;
  lastFeedTime: number | undefined;
}

const GeneralDiagnosticsContent = ({
  waterLevel,
  lastFeedTime,
}: GeneralDiagnosticsContentProps) => {
  return (
    <div className="col-span-full row-span-1 p-4 lg:col-span-6">
      <div className="bg-background flex h-full w-full flex-col rounded-xl p-4">
        <div className="flex w-full items-center gap-x-2">
          <Wifi size={32} />
          <p className="w-full text-2xl font-semibold">ESP32 Standing Water Monitor</p>
        </div>

        <div className="bg-background flex h-full w-full flex-wrap items-center justify-evenly gap-4 p-4">
          {!(waterLevel && lastFeedTime) && <LoadingSpinner />}
          {waterLevel && lastFeedTime && (
            <>
              <WaterLevel waterLevel={waterLevel} />
              <LastFeedTime lastFeedTime={lastFeedTime} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralDiagnosticsContent;
