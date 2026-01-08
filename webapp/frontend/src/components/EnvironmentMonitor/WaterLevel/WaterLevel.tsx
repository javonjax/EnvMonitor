import { Droplet, DropletOff } from 'lucide-react';
// import LoadingSpinner from '../../ui/Custom/LoadingSpinner'

export interface WaterLevelProps {
  waterLevel: string | undefined;
  lastServoTriggerTime: number | undefined;
}

const WaterLevel = ({ waterLevel, lastServoTriggerTime }: WaterLevelProps) => {
  return (
    <div className="h-full xl:w-[20%]">
      <div className="bg-accent flex h-full w-full flex-col items-center justify-center gap-y-4 rounded-xl p-4">
        <p className="text-2xl">Standing Water Level</p>
        {(() => {
          switch (waterLevel) {
            case 'None':
              return <DropletOff size={64} color="oklch(72.3% 0.219 149.579)" />;
            case 'Low':
              return <Droplet size={64} color="oklch(85.2% 0.199 91.936" />;
            case 'High':
              return <Droplet size={64} color="oklch(57.7% 0.245 27.325)" />;
            default:
              return <Droplet size={64} color="oklch(0.8 0 0)" />;
          }
        })()}
        <p>{waterLevel}</p>

        <p className="text-center">
          Last drained: <br></br>
          {new Date(Number(lastServoTriggerTime)).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default WaterLevel;
