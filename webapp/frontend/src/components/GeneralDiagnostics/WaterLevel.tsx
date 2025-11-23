export interface WaterLevelProps {
  waterLevel: string | undefined;
}

const WaterLevel = ({ waterLevel }: WaterLevelProps) => {
  return <div className="h-[200px] w-[200px] shrink-0 border-2 border-blue-500">{waterLevel}</div>;
};

export default WaterLevel;
