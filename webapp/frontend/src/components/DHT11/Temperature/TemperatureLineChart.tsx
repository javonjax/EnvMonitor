import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { EnvMonitorData } from '@backend/types';
import { AreaChart, CartesianGrid, XAxis, Area, YAxis } from 'recharts';

export interface TemperatureLineChartProps {
  lineChartData: EnvMonitorData[];
}

const TemperatureLineChart = ({ lineChartData }: TemperatureLineChartProps) => {
  const chartData = lineChartData.map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'short',
    }),
    temperature: item.temperature,
  }));

  return (
    <div className="h-[200px] w-[80%]">
      <ChartContainer config={{}} className="h-full w-full">
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="timestamp" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis dataKey="temperature" domain={['dataMin - 10', 'dataMax + 10']} tickLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <Area
            dataKey="temperature"
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

export default TemperatureLineChart;
