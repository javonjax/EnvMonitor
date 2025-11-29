export interface CurrentWeatherOverviewProps {
  weatherOverview: string | undefined;
}
const CurrentWeatherOverview = ({ weatherOverview }: CurrentWeatherOverviewProps) => {
  return (
    <div className="bg-test flex h-full max-h-[250px] min-h-0 w-full flex-col gap-y-2 rounded-xl p-4">
      <p className="w-full">AI Weather Overview</p>
      <p className="overflow-y-auto text-[14px]">{weatherOverview}</p>
    </div>
  );
};

export default CurrentWeatherOverview;
