import WaterLevel from './WaterLevel';

import LastFeedTime from './LastFeedTime';
import MotionDetection from './MotionDetection';

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
    <div className="col-span-full row-span-2 flex min-h-[400px] flex-col items-center justify-evenly border-2 border-purple-500 lg:min-h-0">
      <div className="flex h-full w-full flex-wrap items-center justify-evenly gap-4 border-2 border-blue-500 p-4">
        <WaterLevel waterLevel={waterLevel} />
        <LastFeedTime lastFeedTime={lastFeedTime} />
        <MotionDetection motionDetection={motionDetection} />
      </div>
      <p>Last update: {new Date(Number(lastMessageTime)).toLocaleString()}</p>
    </div>
  );
};

export default GeneralDiagnosticsContent;
