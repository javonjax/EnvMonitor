import { Droplet, DropletOff } from 'lucide-react';
import LoadingSpinner from '../ui/Custom/LoadingSpinner';

export interface WaterLevelProps {
  waterLevel: string | undefined;
}

const WaterLevel = ({ waterLevel }: WaterLevelProps) => {
  return (
    <div className="h-[200px] w-[200px] shrink-0">
      <div className="bg-accent flex h-full w-full flex-col items-center justify-center gap-y-4 rounded-xl">
        <p>Standing Water Level</p>
        {(() => {
          switch (waterLevel) {
            case 'Empty':
              return <DropletOff size={64} color="oklch(57.7% 0.245 27.325)" />;
            case 'Low':
              return <Droplet size={64} color="oklch(85.2% 0.199 91.936" />;
            case 'OK':
              return <Droplet size={64} color="oklch(72.3% 0.219 149.579)" />;
            default:
              return <Droplet size={64} color="oklch(0.8 0 0)" />;
          }
        })()}
        <p>{waterLevel}</p>
      </div>
    </div>
  );
};

export default WaterLevel;
