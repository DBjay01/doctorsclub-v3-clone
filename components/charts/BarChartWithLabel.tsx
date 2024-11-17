"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { getPatientsLast7Days } from "@/lib/actions/patient.actions";
import { formatChartData } from "@/utils/formatChartData";
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

// Chart configuration
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Helper function to format date as 'DD MMM'
const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};

export function BarChartWithLabel({ doctorId }: { doctorId: string }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patients = await getPatientsLast7Days(doctorId);
        const formattedData = formatChartData(patients.documents);
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };

    fetchData();
  }, [doctorId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Count Over Last 7 Days</CardTitle>
        <CardDescription>Daily count of patients added</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={formatDate} // Format date as 'DD MMM'
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="blue" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col mt-7  items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing patient data for the last 7 days
        </div>
      </CardFooter>
    </Card>
  );
}   