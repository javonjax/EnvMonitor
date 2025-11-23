import TemperatureCurrentValue from './TemperatureCurrentValue';
import TemperatureLineChart from './TemperatureLineChart';

export interface TemperatureContentProps {
  temperature: number | undefined;
}

const TemperatureContent = ({ temperature }: TemperatureContentProps) => {
  return (
    <div className="flex h-full w-full items-center gap-4 border-2 border-blue-500 p-4">
      <TemperatureCurrentValue temperature={temperature} />
      <TemperatureLineChart />
    </div>
  );
};

export default TemperatureContent;
