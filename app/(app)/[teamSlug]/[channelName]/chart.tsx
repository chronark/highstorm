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
        padding={[0, 40, 40, 40]}

        xField="time"
        yField="usage"
        color={"#7c3aed"}

        xAxis={{
            tickCount: 3,
            
        }}
        yAxis={{
            tickCount: 0,
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