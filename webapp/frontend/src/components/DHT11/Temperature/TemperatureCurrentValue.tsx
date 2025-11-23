export interface TemperatureCurrentValueProps {
  temperature: number | undefined;
}

const TemperatureCurrentValue = ({ temperature }: TemperatureCurrentValueProps) => {
  return <div className="h-[200px] w-[200px] shrink-0 border-2 border-blue-500">{temperature}</div>;
};

export default TemperatureCurrentValue;
