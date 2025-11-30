import WaterLevel from './WaterLevel';

import LastFeedTime from './LastFeedTime';
import MotionDetection from './MotionDetection';
import { useEffect, useState } from 'react';
import { Droplet, Wifi } from 'lucide-react';

export interface GeneralDiagnosticsContentProps {
  waterLevel: string | undefined;
  lastFeedTime: number | undefined;
  motionDetection: string | undefined;
  lastMessageTime: number | undefined;
}

const GeneralDiagnosticsContent = ({
  waterLevel,
  lastFeedTime,
  motionDetection,
  lastMessageTime,
}: GeneralDiagnosticsContentProps) => {
  return (
    <div className="col-span-full row-span-2 p-4 lg:col-span-3">
      <div className="bg-accent flex h-full w-full flex-col rounded-xl p-4">
        <div className="flex w-full items-center gap-x-2">
          <Wifi size={32} />
          <p className="w-full text-2xl font-semibold">ESP32 Bird Bath and Feeder</p>
        </div>

        <div className="bg-accent flex h-full w-full flex-wrap items-center justify-evenly gap-4 p-4">
          <WaterLevel waterLevel={waterLevel} />
          <LastFeedTime lastFeedTime={lastFeedTime} />
          {/* <MotionDetection motionDetection={motionDetection} /> */}
        </div>
      </div>
    </div>
  );
};

export default GeneralDiagnosticsContent;
