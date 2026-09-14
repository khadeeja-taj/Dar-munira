"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

// Brand-derived categorical palette (from the blueprint mark).
export const PALETTE = [
  "#0B5D3B",
  "#7FBF3F",
  "#16788F",
  "#4FC3D9",
  "#0B3D28",
  "#A8D879",
  "#2E9E7B",
  "#8AB6C4",
];

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid rgba(11,93,59,.15)",
  background: "rgba(255,255,255,.96)",
  fontSize: 12,
  boxShadow: "0 8px 24px rgba(11,61,40,.12)",
};

export function DonutChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const filtered = data.filter((d) => d.value > 0);
  if (filtered.length === 0) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={filtered}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          stroke="none"
        >
          {filtered.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12 }}
          formatter={(v) => <span style={{ color: "#42544a" }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function BarsChart({
  data,
  color = "#0B5D3B",
}: {
  data: { name: string; value: number }[];
  color?: string;
}) {
  if (data.length === 0) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,93,59,.08)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#5e7268" }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fontSize: 11, fill: "#5e7268" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(127,191,63,.08)" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({
  data,
}: {
  data: { month: string; students: number; instructors: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,93,59,.08)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5e7268" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#5e7268" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="students"
          stroke="#0B5D3B"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#0B5D3B" }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="instructors"
          stroke="#7FBF3F"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#7FBF3F" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function Empty() {
  return (
    <div className="grid h-[240px] place-items-center text-sm text-brand-muted">
      No data yet
    </div>
  );
}
