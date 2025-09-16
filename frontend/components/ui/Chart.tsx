"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
}

export function LineChartComponent({
  data,
  xKey,
  yKey,
  color = "#6366f1", // Indigo-500 for nicer UI
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "#374151", fontSize: 12 }}
          axisLine={{ stroke: "#d1d5db" }}
        />
        <YAxis
          tick={{ fill: "#374151", fontSize: 12 }}
          axisLine={{ stroke: "#d1d5db" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            fontSize: "0.875rem",
            color: "#111827",
          }}
        />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 4, fill: color }}
          activeDot={{ r: 6, stroke: "#4f46e5", strokeWidth: 2 }}
          isAnimationActive={true}
          animationDuration={1200}
          animationEasing="ease-in-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface PieChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
}

export function PieChartComponent({
  data,
  colors = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#9333ea"],
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
          animationDuration={1200}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
