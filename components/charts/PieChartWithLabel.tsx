"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getVisitReasonDistribution } from "@/lib/actions/patient.actions";

export const description = "A bar chart showing distribution of patient visit reasons.";

interface VisitReason {
  reason: string;
  count: number;
}

const chartConfig = {}; // Define a basic or empty config if needed

export function PieChartWithLabel({ doctorId }: { doctorId: string }) {
  const [data, setData] = useState<VisitReason[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dist = await getVisitReasonDistribution(doctorId);
        setData(dist);
      } catch (error) {
        console.error("Error fetching visit reason distribution:", error);
      }
    };

    fetchData();
  }, [doctorId]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visit Reasons Distribution</CardTitle>
        <CardDescription>Distribution of patient visit reasons</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto text-sm w-full h-[500px] pb-5"
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              left: 20, // Adjust left margin to prevent text overflow
              right: 20,
              top: 20,
              bottom: 20,
            }}
            width={500} // Set appropriate width for the chart
            height={400} // Set appropriate height for the chart
          >
            <YAxis
              dataKey="reason"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={150} // Adjust width to accommodate long text labels
            />
            <XAxis dataKey="count" type="number" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="count"
              fill="blue" // Set the bar color to blue
              layout="vertical"
              radius={5}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing the distribution of patient visit reasons
        </div>
      </CardFooter>
    </Card>
  );
}   