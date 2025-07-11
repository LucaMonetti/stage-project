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
  stokeWidth?: number;
  dot?: boolean;
  strokeDashed?: boolean;
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

    if (datas.length === 0) {
      setData([]);
      return;
    }

    // Create a map for existing data grouped by day
    const lastPerDayMap = new Map<string, DataType>();

    datas.forEach((entry) => {
      // Handle both Date objects and date strings
      const dateValue = entry.y instanceof Date ? entry.y : new Date(entry.y);

      if (!isNaN(dateValue.getTime())) {
        const day = dateValue.toISOString().split("T")[0];
        const existing = lastPerDayMap.get(day);

        // Create entry with proper Date object
        const dateEntry = { ...entry, y: dateValue } as DataType;

        if (!existing || dateValue > new Date(existing.y)) {
          lastPerDayMap.set(day, dateEntry);
        }
      }
    });

    // Find the date range from the map values
    const allValidDates = Array.from(lastPerDayMap.values())
      .map((entry) => new Date(entry.y))
      .filter((date) => !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    if (allValidDates.length === 0) {
      setData([]);
      return;
    }

    const startDate = allValidDates[0];
    const endDate = allValidDates[allValidDates.length - 1];
    startDate.setDate(endDate.getDate() - 10);
    endDate.setDate(endDate.getDate() + 10);

    // Generate complete date range
    const completeDateRange: DataType[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayKey = currentDate.toISOString().split("T")[0];
      const existingData = lastPerDayMap.get(dayKey);

      if (existingData) {
        completeDateRange.push(existingData);
      } else {
        // Create empty entry for missing dates
        const emptyEntry = {
          y: new Date(currentDate),
          x: null,
        } as DataType;

        // Set all line data keys to null for missing dates
        lineCols.forEach((line) => {
          (emptyEntry as any)[line.dataKey] = null;
        });

        completeDateRange.push(emptyEntry);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    setData(completeDateRange);
  }, [dataset, lineCols]);

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
            type="category"
            scale="point"
            tickFormatter={(value, index) => {
              const currentDate = new Date(value);
              const prevDate = index > 0 ? new Date(data[index - 1]?.y) : null;

              // Show label only if it's the first day of the month or if the month changed
              if (currentDate.getDate() == 1) {
                return new Intl.DateTimeFormat("it-IT", {
                  month: "long",
                  year:
                    currentDate.getFullYear() !== new Date().getFullYear()
                      ? "numeric"
                      : undefined,
                }).format(currentDate);
              }
              return "";
            }}
            interval={0}
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
              key={index}
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={line.stokeWidth ?? 2}
              dot={line.dot !== false ? { r: 4, fill: "#101828" } : false}
              name={line.name}
              label={line.label}
              activeDot={line.dot !== false ? { r: 6, fill: "#101828" } : false}
              connectNulls={true}
              strokeDasharray={line.strokeDashed ? "6 4" : "none"}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </WidgetBase>
  );
}

export default GraphWidget;
