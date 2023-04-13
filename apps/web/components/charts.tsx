"use client";

import { Area, Column } from "@ant-design/plots";

/**
 *
 */
export function fillRange(
  data: { value: number; time: number }[],
  start: number,
  _end: number,
  step: "1m" | "1h" | "1d",
): { value: number; time: number }[] {
  const t = new Date(start);
  const series: { value: number; time: number }[] = [];
  while (t.getTime() <= new Date().getTime()) {
    const d = data.find((u) => {
      switch (step) {
        case "1m":
          return new Date(u.time).setUTCSeconds(0, 0) === new Date(t).setUTCSeconds(0, 0);

        case "1h":
          return new Date(u.time).setUTCMinutes(0, 0, 0) === new Date(t).setUTCMinutes(0, 0, 0);
        case "1d":
          return new Date(u.time).setUTCHours(0, 0, 0, 0) === new Date(t).setUTCHours(0, 0, 0, 0);

        default:
          throw new Error(`Unhandled step: ${step}`);
      }
    });
    series.push({
      time: t.getTime(),
      value: d?.value ?? 0,
    });

    // Now increment the time
    switch (step) {
      case "1m":
        t.setUTCMinutes(t.getUTCMinutes() + 1);
        break;
      case "1h":
        t.setUTCHours(t.getUTCHours() + 1);
        break;
      case "1d":
        t.setUTCDate(t.getUTCDate() + 1);
        break;

      default:
        throw new Error(`Unhandled step: ${step}`);
    }
  }
  return series;
}

type Props = {
  data: {
    x: string;
    y: number;
  }[];
};

export const AreaChart: React.FC<Props> = ({ data }) => {
  return (
    <Area
      theme="dark"
      autoFit={true}
      data={data}
      smooth={true}
      padding={[40, 40, 30, 40]}
      xField="x"
      yField="y"
      color="#e5e5e5"
      areaStyle={() => {
        return {
          fill: "l(270) 0:#000 1:#e5e5e5",
        };
      }}
      xAxis={{
        tickCount: 3,
      }}
      yAxis={{
        tickCount: 3,
        label: {
          formatter: (v: string) =>
            Intl.NumberFormat(undefined, { notation: "compact" }).format(Number(v)),
        },
      }}
      tooltip={{
        formatter: (datum) => ({
          name: "Events",
          value: Intl.NumberFormat(undefined, { notation: "compact" }).format(Number(datum.y)),
        }),
      }}
    />
  );
};

export const ColumnChart: React.FC<Props> = ({ data }) => {
  return (
    <Column
      theme="dark"
      autoFit={true}
      data={data}
      padding={[40, 40, 30, 40]}
      xField="x"
      yField="y"
      color="#e5e5e5"
      xAxis={{
        tickCount: 3,
      }}
      yAxis={{
        tickCount: 3,
        label: {
          formatter: (v: string) =>
            Intl.NumberFormat(undefined, { notation: "compact" }).format(Number(v)),
        },
      }}
      tooltip={{
        formatter: (datum) => ({
          name: "Events",
          value: Intl.NumberFormat(undefined, { notation: "compact" }).format(Number(datum.y)),
        }),
      }}
    />
  );
};
