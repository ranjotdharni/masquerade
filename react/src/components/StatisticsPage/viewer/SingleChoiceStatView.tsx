import type { ApexOptions } from "apexcharts"
import { DIFF_COLOR_LIST } from "../../../lib/constants"
import type { SingleChoiceQuestion } from "../../../lib/types/api"
import { useState } from "react"
import ReactApexChart from "react-apexcharts"

export type SingleChoiceStatViewProps = {
    question: SingleChoiceQuestion
}

export default function SingleChoiceStatView({ question } : SingleChoiceStatViewProps) {
    const [columnChart] = useState<ApexOptions>({
        series: [{
            data: question.answers!.map(a => a.submissions!)
        }],
        colors: DIFF_COLOR_LIST,
        plotOptions: {
            bar: {
                columnWidth: '10%',
                distributed: true,
                borderRadius: 5,
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        },
    })

    return (
        <>
            <header className="w-full h-[10%] flex flex-row justify-between items-center">
                <h3 className="text-text font-jbm p-2 border border-2 bg-inactive-light">{question.question}</h3>
                <p className="p-1 text-text font-lato">Question Submissions: <span className="font-lato-bold">{question.submissions}</span></p>
            </header>

            <div className="w-full h-[90%] flex flex-row">
                <section className="w-1/2 h-full flex flex-col justify-evenly items-center">
                    <ul className="w-full h-[40%] rounded-xl shadow-lg border border-background-light flex flex-col justify-evenly px-2 py-1">
                        {
                            question.answers?.map((a, i) => {
                                return (
                                    <li key={a._id.$oid} className="w-full p-2 space-x-2 flex flex-row items-center">
                                        <div aria-hidden style={{backgroundColor: DIFF_COLOR_LIST[i]}} className="w-2 aspect-square rounded-xl"></div>
                                        <p className="text-sm text-secondary font-jbm-italic">{a.answer}</p>
                                    </li>
                                )
                            })
                        }
                    </ul>

                    <figure className="w-full h-[40%] rounded-xl shadow-lg border border-background-light flex flex-col justify-evenly px-2 py-1">
                        <ReactApexChart width="100%" height="100%" series={columnChart.series} type="bar" options={columnChart} />
                        <figcaption>This is a figure.</figcaption>
                    </figure>
                </section>

                <section className="w-1/2 h-full">

                </section>
            </div>
        </>
    )
}
