"use client"

import { Area } from "@ant-design/plots"





type Props = {
    data: {
        time: number,
        count: number
    }[]
}


export const Chart: React.FC<Props> = ({ data }) => {
    const day = new Date();
    day.setUTCHours(0, 0, 0, 0)
    const series = [];
    for (let i = 0; i < 30; i++) {
        const usage = data.find((u) => {
            return new Date(u.time).toDateString() === day.toDateString();
        });
        series.unshift({
            time: day.toDateString(),
            usage: usage?.count ?? 0,
        });
        day.setUTCDate(day.getUTCDate() - 1);
    }

    return <Area
        autoFit={true}
        data={series}
        smooth={true}
        padding={[40, 40, 30, 40]}

        xField="time"
        yField="usage"
        color="#34d399"
        areaStyle={() => {
            return {
                fill: 'l(270) 0:#ffffff 1:#34d399',
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
                value: Intl.NumberFormat(undefined, { notation: "compact" }).format(Number(datum.usage)),
            }),
        }}
    />
}