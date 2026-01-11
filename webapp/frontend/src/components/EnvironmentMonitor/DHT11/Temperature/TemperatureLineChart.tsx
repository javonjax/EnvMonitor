import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { EnvMonitorData } from '@/lib/types';
import { AreaChart, CartesianGrid, XAxis, Area, YAxis } from 'recharts';

export interface TemperatureLineChartProps {
  lineChartData: EnvMonitorData[];
}

const TemperatureLineChart = ({ lineChartData }: TemperatureLineChartProps) => {
  const chartData = lineChartData.map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour12: false,
    }),
    temperature: item.temperature,
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
          <YAxis dataKey="temperature" domain={['dataMin - 5', 'dataMax + 5']} tickLine={false} />
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
