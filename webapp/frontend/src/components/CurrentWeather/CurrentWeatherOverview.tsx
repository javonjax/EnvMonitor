export interface CurrentWeatherOverviewProps {
  weatherOverview: string | undefined;
}
const CurrentWeatherOverview = ({ weatherOverview }: CurrentWeatherOverviewProps) => {
  return (
    <div className="bg-accent flex h-full w-full flex-col gap-y-2 rounded-xl p-4">
      <p className="w-full">AI Weather Overview</p>
      <p className="text-[14px]">{weatherOverview}</p>
    </div>
  );
};

export default CurrentWeatherOverview;
