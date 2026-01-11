import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { EnvMonitorData } from '@/lib/types';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export interface HumidityLineChartProps {
  lineChartData: EnvMonitorData[];
}
const HumidityLineChart = ({ lineChartData }: HumidityLineChartProps) => {
  const chartData = lineChartData.map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour12: false,
    }),
    humidity: item.humidity,
  }));

  return (
    <div className="h-[90%] w-[80%]">
      <ChartContainer config={{}} className="-ml-4 h-full w-full">
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickMargin={8}
            minTickGap={32}
            textAnchor="end"
            angle={-45}
            height={75}
          />
          <YAxis domain={[0, 100]} />
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
