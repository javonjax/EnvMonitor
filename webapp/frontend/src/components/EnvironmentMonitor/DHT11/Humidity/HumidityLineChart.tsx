import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { EnvMonitorData } from '@backend/types';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export interface HumidityLineChartProps {
  lineChartData: EnvMonitorData[];
}
const HumidityLineChart = ({ lineChartData }: HumidityLineChartProps) => {
  const chartData = lineChartData.map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'short',
    }),
    humidity: item.humidity,
  }));

  return (
    <div className="h-[80%] w-[80%]">
      <ChartContainer config={{}} className="-ml-4 h-full w-full">
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="timestamp" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis dataKey="humidity" domain={['dataMin - 5', 'dataMax + 5']} tickLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <Area
            dataKey="humidity"
            type="natural"
            fill="var(--color-background)"
            fillOpacity={0.6}
            stroke="var(--color-foreground)"
            strokeOpacity={0.8}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default HumidityLineChart;
