import WaterLevel from './WaterLevel';

import LastFeedTime from './LastFeedTime';
import MotionDetection from './MotionDetection';
import { useEffect, useState } from 'react';

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
    <div className="col-span-full row-span-2 min-h-[400px] border-2 border-purple-500 lg:col-span-3 lg:min-h-0">
      <div className="flex h-full w-full flex-wrap items-center justify-evenly gap-4 border-2 border-blue-500 p-4">
        <WaterLevel waterLevel={waterLevel} />
        <LastFeedTime lastFeedTime={lastFeedTime} />
        <MotionDetection motionDetection={motionDetection} />
        <p>Last Update: {new Date(Number(lastMessageTime)).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default GeneralDiagnosticsContent;
