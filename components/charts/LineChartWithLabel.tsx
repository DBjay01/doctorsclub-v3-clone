"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getPatientDistributionByHour } from "@/lib/actions/patient.actions"; // This will fetch the patient data

export const description = "Patient time distribution during the day";

const formatHourTo12Hour = (hour: number) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour} ${suffix}`;
};    

const chartConfig = {
  visits: {
    label: "Visits",
    color: "hsl(var(--chart-1))", // Custom blue color
  },
} satisfies ChartConfig;

export function LineChartWithLabel({ doctorId }: { doctorId: string }) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPatientDistributionByHour(doctorId);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching patient distribution data:", error);
      }
    };

    fetchData();
  }, [doctorId]);

  return (
    <Card>   
      <CardHeader>
        <CardTitle>Patient Distribution by Hour</CardTitle>
        <CardDescription>Real-time data for today&apos;s patient visits</CardDescription>
      </CardHeader> 
      <CardContent>
        <ChartContainer config={chartConfig} className="text-sm">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              left: 10,
              right: 12,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(hour) => formatHourTo12Hour(hour)} 
            domain={[0, 23]}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: "Patient Visits", angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="visits"
              type="monotone"
              stroke="#000FFF" // Change to blue
              strokeWidth={2}
              dot={{
                fill: "#000FFF", // Custom blue color for dots
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start mt-7 gap-2 text-sm"> 
        <div className="leading-none text-muted-foreground">
          Showing hourly data for today
        </div>
      </CardFooter>
    </Card>
  );
}                  