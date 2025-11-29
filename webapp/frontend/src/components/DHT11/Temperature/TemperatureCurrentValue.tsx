export interface TemperatureCurrentValueProps {
  temperature: number | undefined;
}

const TemperatureCurrentValue = ({ temperature }: TemperatureCurrentValueProps) => {
  return (
    <div className="flex w-[20%] shrink-0 items-center justify-center">
      <p className="text-5xl font-semibold">{temperature + '°F'}</p>
    </div>
  );
};

export default TemperatureCurrentValue;
