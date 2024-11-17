"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";

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

export const description = "A radial chart with a label";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "#007BFF" }, // Blue
  { browser: "safari", visitors: 200, fill: "#0056b3" }, // Darker Blue
  { browser: "firefox", visitors: 187, fill: "#003d7a" }, // Even Darker Blue
  { browser: "edge", visitors: 173, fill: "#3399ff" }, // Light Blue
  { browser: "other", visitors: 90, fill: "#66ccff" }, // Lighter Blue
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "#007BFF", // Blue
  },
  safari: {
    label: "Safari",
    color: "#0056b3", // Darker Blue
  },
  firefox: {
    label: "Firefox",
    color: "#003d7a", // Even Darker Blue
  },
  edge: {
    label: "Edge",
    color: "#3399ff", // Light Blue
  },
  other: {
    label: "Other",
    color: "#66ccff", // Lighter Blue
  },
} satisfies ChartConfig;

export function RadialChartWithLabel() {  
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 mt-4 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={270} // Changed to 270 for proper full circle
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar dataKey="visitors" background>
              <LabelList
                position="insideStart"
                dataKey="browser"
                className="fill-gray-200 capitalize" // Adjusted for dark mode
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}