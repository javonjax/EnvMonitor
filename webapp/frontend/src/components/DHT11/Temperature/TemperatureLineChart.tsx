import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { EnvMonitorData } from '@backend/types';
import { TrendingUp } from 'lucide-react';
import { AreaChart, CartesianGrid, XAxis, Area } from 'recharts';

export interface TemperatureLineChartProps {
  lineChartData: EnvMonitorData[];
}

const TemperatureLineChart = ({ lineChartData }: TemperatureLineChartProps) => {
  const chartData = [
    { month: 'January', desktop: 186 },
    { month: 'February', desktop: 305 },
    { month: 'March', desktop: 237 },
    { month: 'April', desktop: 73 },
    { month: 'May', desktop: 209 },
    { month: 'June', desktop: 214 },
  ];

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <div className="h-[200px] w-[80%]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <Area
            dataKey="desktop"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default TemperatureLineChart;
