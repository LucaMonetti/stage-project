import type { Path } from "react-hook-form";
import WidgetBase, { type QueryDimensions } from "./WidgetBase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useEffect, useState } from "react";

export type LineConfig<DataType> = {
  dataKey: Path<DataType>;
  stroke: string;
  label?: string;
  name?: string;
};

type Props<T, DataType> = {
  title?: React.ReactNode;
  dimensions?: QueryDimensions;
  dataset: T[];
  lineCols: LineConfig<DataType>[];
  getData: (item: T) => DataType;
};

function GraphWidget<T, DataType extends { y: any; x: any }>({
  title,
  dimensions,
  dataset,
  lineCols,
  getData,
}: Props<T, DataType>) {
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    let datas: DataType[] = dataset.map(getData);

    const lastPerDayMap = new Map<string, DataType>();

    datas.forEach((entry) => {
      if (entry.y instanceof Date) {
        const day = entry.y.toISOString().split("T")[0];
        const existing = lastPerDayMap.get(day);

        if (!existing || entry.y > existing.y) {
          lastPerDayMap.set(day, entry);
        }
      }

      lastPerDayMap.set(entry.y, entry);
    });

    const filteredData = Array.from(lastPerDayMap.values()).sort(
      (a, b) => a.y.getTime() - b.y.getTime()
    );

    setData(filteredData);
    console.log("Filtered Data", filteredData);
    console.log("Data State", data);
  }, [dataset]);

  return (
    <WidgetBase dimensions={dimensions}>
      <h2 className="uppercase font-bold text-gray-500 mb-4">{title}</h2>
      <ResponsiveContainer
        width="100%"
        height={400}
        style={{ outline: "none", border: "none" }}
      >
        <LineChart data={data}>
          <CartesianGrid stroke="#333" strokeDasharray="3 3" />
          <XAxis
            dataKey="y"
            stroke="#fff"
            tick={{ fill: "#fff" }}
            padding={{ left: 30, right: 30 }}
            tickFormatter={(value) =>
              new Intl.DateTimeFormat("it-IT", {
                day: "2-digit",
                month: "short",
              }).format(new Date(value))
            }
          />
          <YAxis stroke="#fff" tick={{ fill: "#fff" }} padding={{ top: 30 }} />
          <Tooltip
            animationEasing="linear"
            contentStyle={{
              backgroundColor: "#101828",
              borderRadius: 8,
              padding: 16,
            }}
            labelFormatter={(value) =>
              new Intl.DateTimeFormat("it-IT", {
                dateStyle: "full",
              }).format(new Date(value))
            }
          />
          {lineCols.map((line, index) => (
            <Line
              type="monotone"
              strokeWidth={2}
              key={index}
              {...line}
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </WidgetBase>
  );
}

export default GraphWidget;
