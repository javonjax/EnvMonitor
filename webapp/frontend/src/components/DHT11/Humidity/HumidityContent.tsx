import HumidityCurrentValue from './HumidityCurrentValue';
import HumidityLineChart from './HumidityLineChart';

export interface HumidityContentProps {
  humidity: number | undefined;
}

const HumidityContent = ({ humidity }: HumidityContentProps) => {
  return (
    <div className="flex h-full w-full items-center gap-4 border-2 border-blue-500 p-4">
      <HumidityCurrentValue humidity={humidity} />
      <HumidityLineChart />
    </div>
  );
};

export default HumidityContent;
