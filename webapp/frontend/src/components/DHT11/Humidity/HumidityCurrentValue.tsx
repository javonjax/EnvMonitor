export interface HumidityCurrentValueProps {
  humidity: number | undefined;
}

const HumidityCurrentValue = ({ humidity }: HumidityCurrentValueProps) => {
  return (
    <div className="flex h-[200px] w-[20%] shrink-0 items-center justify-center">
      <p className="text-3xl font-semibold lg:text-5xl">{humidity + '%'}</p>
    </div>
  );
};

export default HumidityCurrentValue;
