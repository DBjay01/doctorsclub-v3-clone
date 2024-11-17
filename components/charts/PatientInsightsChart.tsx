"use client";

import React from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, Tooltip, Legend } from 'recharts';

// Define the structure of the chart data
interface PatientData {
  month: string;
  patients: number;
}

interface PatientInsightsChartProps {
  data: PatientData[];
}

const PatientInsightsChart: React.FC<PatientInsightsChartProps> = ({ data }) => {
  return (
    <div className="chart-container">
      <h2 className="text-xl font-semibold">Patient Insights</h2>
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <Tooltip />
        <Legend />
        <Bar dataKey="patients" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default PatientInsightsChart;