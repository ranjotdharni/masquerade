import type { ApexOptions } from "apexcharts"
import { DIFF_COLOR_LIST } from "../../../lib/constants"
import type { SingleChoiceQuestion } from "../../../lib/types/api"
import { useState } from "react"
import ReactApexChart from "react-apexcharts"

export type SingleChoiceStatViewProps = {
    question: SingleChoiceQuestion
}

export default function SingleChoiceStatView({ question } : SingleChoiceStatViewProps) {
    function getArrayAsPercentages(arr: number[]) {
        let total = 0
        arr.forEach(a => { total += a })
        return arr.map(a => parseFloat((a * 100 / total).toFixed(2)))
    }

    const [columnChart] = useState<ApexOptions>({
        series: [{
            name: "Submissions",
            data: question.answers!.map(a => { return { y: a.submissions!, x: ""} })
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
        chart: {
            toolbar: {
                show: false
            }
        },
        xaxis: {
            title: {
                text: "Submissions (per answer)",
                style: {
                    color: "var(--color-text)",
                    fontFamily: "var(--font-jbm-italic)",
                    
                }
            },
            labels: {
                show: false
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontFamily: "var(--font-jbm-bold)"
                }
            }
        },
        tooltip: {
            style: {
                fontFamily: "var(--font-jbm-italic)",
            }
        }
    })

    const [donutChart] = useState<ApexOptions>({
        series: [{
            name: "Submissions",
            data: question.answers!.map(a => { return { y: a.submissions!, x: ""} })
        }],
        colors: DIFF_COLOR_LIST,
        stroke: {
            width: 3,
            curve: "linestep",
            lineCap: "round",
            colors: ["var(--color-background)"]
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "90%",
                    background: "transparent",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            fontFamily: "var(--font-jbm)",
                            fontSize: "0.85rem",
                            color: "var(--color-secondary)",
                            label: "Question Submissions"
                        },
                        value: {
                            color: "var(--color-text)",
                            fontFamily: "var(--font-jbm-bold)"
                        }
                    },
                },
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        },
        chart: {
            type: "donut",
            toolbar: {
                show: false
            }
        },
        tooltip: {
            style: {
                fontFamily: "var(--font-jbm-italic)",
            },
            
        }
    })

    const [radialChart] = useState<ApexOptions>({
        series: getArrayAsPercentages(question.answers!.map(a => a.submissions!)),
        colors: DIFF_COLOR_LIST,
        stroke: {
            width: 3,
            lineCap: "round",
            colors: ["var(--color-background)"]
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    show: true,
                    name: {
                        show: true,
                        fontFamily: "var(--font-jbm-italic)",
                        color: "var(--color-secondary)",
                    },
                    value: {
                        show: true,
                        fontFamily: "var(--font-jbm-bold)",
                        color: "var(--color-text)"
                    },
                    total: {
                        fontFamily: "var(--font-jbm-italic)",
                        fontSize: "0.8rem",
                        color: "var(--color-secondary)",
                        show: true,
                        label: "Percentages",
                        formatter: function() {
                            return ""
                        }
                    }
                },
                hollow: {
                    size: "50%",
                    margin: 0
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        },
        chart: {
            type: "radialBar",
            toolbar: {
                show: false
            }
        },
        labels: question.answers!.map(_ => "Portion"),
    })

    return (
        <>
            <header className="w-full h-[10%] flex flex-row justify-between items-center">
                <h3 className="text-text font-jbm p-2 border border-2 bg-inactive-light">{question.question}</h3>
                <p className="text-sm text-inactive font-jbm-italic">Hover over chart segments for details</p>
            </header>

            <div className="w-full h-[90%] flex flex-row">
                <section className="w-1/2 h-full flex flex-col justify-evenly items-center">
                    <div className="w-full h-[40%] rounded-xl shadow-lg border border-background-light flex flex-col justify-evenly">
                        <header className="w-full h-[15%] flex flex-row justify-end items-center px-8 border-b border-inactive-light">
                            <h3 className="font-jbm-bold text-text text-lg px-4">Answer Key</h3>
                        </header>
                        <ul className="w-full h-[85%] flex flex-col justify-evenly px-2">
                            {
                                question.answers?.map((a, i) => {
                                    return (
                                        <li key={a._id.$oid} className="w-full px-2 space-x-2 flex flex-row items-center">
                                            <div aria-hidden style={{backgroundColor: DIFF_COLOR_LIST[i]}} className="w-2 aspect-square rounded-xl"></div>
                                            <p className="text-sm text-secondary font-jbm-italic">{a.answer}</p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>

                    <figure className="w-full h-[40%] rounded-xl shadow-lg border border-background-light flex flex-col justify-evenly px-2 pt-1 pb-2">
                        <ReactApexChart width="100%" height="100%" series={columnChart.series} type="bar" options={columnChart} />
                    </figure>
                </section>

                <section className="w-1/2 h-full flex flex-col justify-evenly items-center">
                        <div className="w-full h-[40%] flex flex-row justify-evenly items-center">
                            <figure className="w-[40%] h-full rounded-lg shadow-md border border-background-light p-2">
                                <ReactApexChart width="100%" height="100%" series={donutChart.series} type="donut" options={donutChart} />
                            </figure>
                            <figure className="w-[40%] h-full rounded-lg shadow-md border border-background-light p-2">
                                <ReactApexChart width="100%" height="100%" series={radialChart.series} type="radialBar" options={radialChart} />
                            </figure>
                        </div>
                        <div className="w-full h-[40%] flex flex-row justify-evenly items-center">
                            <figure className="w-[40%] h-full rounded-lg shadow-md border border-background-light p-2">

                            </figure>
                            <figure className="w-[40%] h-full rounded-lg shadow-md border border-background-light p-2">

                            </figure>
                        </div>
                </section>
            </div>
        </>
    )
}
