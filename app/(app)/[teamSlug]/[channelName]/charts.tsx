"use client"

import { Area, Column } from "@ant-design/plots"

type Props = {
  data: {
    time: number
    count: number
  }[]
}

export const EventsPerDay: React.FC<Props> = ({ data }) => {
  const day = new Date()
  day.setUTCDate(day.getUTCDate() - 30)
  const series = []
  while (day.getTime() <= new Date().getTime()) {
    const usage = data.find((u) => {
      return new Date(u.time).toDateString() === day.toDateString()
    })
    series.push({
      time: day.toDateString(),
      usage: usage?.count ?? 0,
    })
    day.setUTCDate(day.getUTCDate() + 1)
  }

  return (
    <Column
      autoFit={true}
      data={series}
      padding={[40, 40, 30, 40]}
      xField="time"
      yField="usage"
      color={"#34d399"}
      xAxis={{
        tickCount: 3,
      }}
      yAxis={{
        tickCount: 3,
        label: {
          formatter: (v: string) =>
            Intl.NumberFormat(undefined, { notation: "compact" }).format(
              Number(v)
            ),
        },
      }}
      tooltip={{
        formatter: (datum) => ({
          name: "Events",
          value: Intl.NumberFormat(undefined, { notation: "compact" }).format(
            Number(datum.usage)
          ),
        }),
      }}
    />
  )
}

export const CumulativeEventsPerday: React.FC<Props> = ({ data }) => {
  const day = new Date()
  day.setUTCDate(day.getUTCDate() - 30)
  let usage = 0
  const series = []
  while (day.getTime() <= new Date().getTime()) {
    const d = data.find((u) => {
      return new Date(u.time).toLocaleDateString() === day.toLocaleDateString()
    })

    usage += d?.count ?? 0
    series.push({
      time: day.toDateString(),
      usage,
    })
    day.setUTCDate(day.getUTCDate() + 1)
  }

  return (
    <Area
      autoFit={true}
      data={series}
      smooth={true}
      padding={[40, 40, 30, 40]}
      xField="time"
      yField="usage"
      color="#34d399"
      areaStyle={() => {
        return {
          fill: "l(270) 0:#ffffff 1:#34d399",
        }
      }}
      xAxis={{
        tickCount: 3,
      }}
      yAxis={{
        tickCount: 3,
        label: {
          formatter: (v: string) =>
            Intl.NumberFormat(undefined, { notation: "compact" }).format(
              Number(v)
            ),
        },
      }}
      tooltip={{
        formatter: (datum) => ({
          name: "Events",
          value: Intl.NumberFormat(undefined, { notation: "compact" }).format(
            Number(datum.usage)
          ),
        }),
      }}
    />
  )
}
