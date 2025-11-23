import type { EnvMonitorData } from '../../../../../backend/src/types';

export interface TemperatureLineChartProps {
  lineChartData: EnvMonitorData[];
}

const TemperatureLineChart = ({ lineChartData }: TemperatureLineChartProps) => {
  return (
    <div className="h-[200px] w-full border-2 border-blue-500">
      {/* {lineChartData.map((item) => (
        <p>{item.temperature}</p>
      ))} */}
    </div>
  );
};

export default TemperatureLineChart;
