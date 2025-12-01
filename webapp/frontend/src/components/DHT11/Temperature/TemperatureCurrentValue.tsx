export interface TemperatureCurrentValueProps {
  temperature: number | undefined;
}

const TemperatureCurrentValue = ({ temperature }: TemperatureCurrentValueProps) => {
  return (
    <div className="flex h-[200px] w-[20%] shrink-0 items-center justify-center">
      <p className="text-3xl font-semibold lg:text-5xl">{temperature + '°F'}</p>
    </div>
  );
};

export default TemperatureCurrentValue;
