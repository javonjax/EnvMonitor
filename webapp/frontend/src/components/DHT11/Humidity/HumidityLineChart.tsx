import type { EnvMonitorData } from '../../../../../backend/src/types';

export interface HumidityLineChartProps {
  lineChartData: EnvMonitorData[];
}
const HumidityLineChart = ({ lineChartData }: HumidityLineChartProps) => {
  return (
    <div className="h-[200px] w-full border-2 border-blue-500">
      {/* {' '}
      {lineChartData.map((item) => (
        <p>{item.humidity}</p>
      ))}{' '} */}
    </div>
  );
};

export default HumidityLineChart;
