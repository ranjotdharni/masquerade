import type { ApexOptions } from "apexcharts"
import { DIFF_COLOR_LIST } from "../../../lib/constants"
import type { RatingQuestion } from "../../../lib/types/api"
import { useState } from "react"
import ReactApexChart from "react-apexcharts"
import TitleQuestion from "../consistent/TitleQuestion"

export type RatingStatViewProps = {
    question: RatingQuestion
    surveySubmissions: number
}

export default function RatingStatView({ question, surveySubmissions } : RatingStatViewProps) {
    let values = Object.values(question.answers!)

    function getArrayAsPercentages(arr: number[]) {
        let total = 0
        arr.forEach(a => { total += a })
        return total === 0 ? arr.map(_ => 0) : arr.map(a => parseFloat((a * 100 / total).toFixed(2)))
    }

    const [columnChart] = useState<ApexOptions>({
        series: [{
            name: "Submissions",
            data: values.map(a => { return { y: a, x: ""} })
        }],
        colors: DIFF_COLOR_LIST,
        plotOptions: {
            bar: {
                columnWidth: 10,
                distributed: true,
                borderRadius: 5,
                borderRadiusApplication: "end",
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
            data: values.map(a => { return { y: a, x: ""} })
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
                            fontFamily: "var(--font-jbm-italic)",
                            fontSize: "0.85rem",
                            color: "var(--color-secondary)",
                            label: "Question Submissions",
                            formatter: function() {
                                return question.submissions! + ""
                            }
                        },
                        value: {
                            color: "var(--color-text)",
                            fontFamily: "var(--font-jbm-bold)",
                            formatter: function() {
                                return surveySubmissions + ""
                            }
                        },
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
        series: getArrayAsPercentages(values),
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
        labels: values.map(_ => "Portion"),
    })

    const [pieChart] = useState<ApexOptions>({
        series: [{
            name: "Submissions",
            data: values.map(a => { return { y: a, x: ""} })
        }],
        colors: DIFF_COLOR_LIST,
        stroke: {
            width: 3,
            curve: "linestep",
            lineCap: "round",
            colors: ["var(--color-background)"]
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        },
        chart: {
            type: "pie",
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

    const [answerRateChart] = useState<ApexOptions>({
        series: [surveySubmissions === 0 ? 0 : Math.floor(question.submissions! * 100 / surveySubmissions)],
        chart: {
            type: 'radialBar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 225,
                hollow: {
                    margin: 0,
                    size: '85%',
                    background: 'transparent',
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: 'front',
                },
                track: {
                    strokeWidth: '67%',
                    margin: 0,
                },
                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: true,
                        color: "var(--color-secondary)",
                        fontFamily: "var(--font-jbm-italic)",
                        fontSize: "0.9rem"
                    },
                    value: {
                        formatter: function(val) {
                            return val + "%"
                        },
                        color: "var(--color-text)",
                        fontFamily: "var(--font-jbm-bold)",
                        fontSize: "1rem",
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            colors: ["var(--color-primary)"],
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['var(--color-text)'],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        stroke: {
            lineCap: 'round',
            width: 3,
        },
        labels: ['Answer Rate'],
    })

    return (
        <>
            <TitleQuestion question={question.question} type={question.type} />

            <div className="w-full md:h-[90%] mt-4 md:mt-0 flex flex-col items-center md:flex-row">
                <section className="w-[90%] md:w-1/2 h-full flex flex-col justify-evenly items-center">
                    <div className="w-full md:h-[40%] rounded-xl shadow-lg border border-background-light flex flex-col justify-evenly">
                        <header className="w-full md:h-[15%] flex flex-row justify-end items-center py-2 md:py-0 px-8 border-b border-inactive-light">
                            <h3 className="font-jbm-bold text-text text-lg md:px-4">Answer Key</h3>
                        </header>
                        <ul className="w-full md:h-[85%] flex flex-col justify-evenly px-2">
                            {
                                Object.keys(question.answers!).map((a, i) => {
                                    return (
                                        <li key={`${question._id.$oid}_1x_0${i}`} className="w-full h-18 md:h-auto px-2 space-x-2 flex flex-row items-center">
                                            <div aria-hidden style={{backgroundColor: DIFF_COLOR_LIST[i]}} className="w-2 aspect-square rounded-xl"></div>
                                            <p style={{color: DIFF_COLOR_LIST[i]}} className="text-xs md:text-sm font-jbm-italic">{a}-Star Rating</p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>

                    <figure className="w-full h-[40vh] md:h-[40%] mt-6 md:mt-0 rounded-xl shadow-lg border border-background-light flex flex-col justify-evenly px-2 pt-1 pb-2">
                        <ReactApexChart width="100%" height="100%" series={columnChart.series} type="bar" options={columnChart} />
                    </figure>
                </section>

                <section className="w-full md:w-1/2 h-full flex flex-col justify-evenly items-center pb-8 md:pb-0">
                        <div className="w-full md:h-[40%] flex flex-col md:flex-row justify-evenly items-center">
                            <figure className="w-[90%] md:w-[40%] h-[40vh] md:h-full mt-6 md:mt-0 rounded-lg shadow-md border border-background-light p-2">
                                <ReactApexChart width="100%" height="100%" series={donutChart.series} type="donut" options={donutChart} />
                            </figure>
                            <figure className="w-[90%] md:w-[40%] h-[40vh] md:h-full mt-6 md:mt-0 rounded-lg shadow-md border border-background-light p-2">
                                <ReactApexChart width="100%" height="100%" series={radialChart.series} type="radialBar" options={radialChart} />
                            </figure>
                        </div>
                        <div className="w-full md:h-[40%] flex flex-col md:flex-row justify-evenly items-center">
                            <figure className="w-[90%] md:w-[40%] h-[40vh] md:h-full mt-6 md:mt-0 rounded-lg shadow-md border border-background-light p-2">
                                <ReactApexChart width="100%" height="90%" series={pieChart.series} type="pie" options={pieChart} />
                                <figcaption className="h-[10%] w-full flex flex-row justify-center items-center text-xs font-jbm-bold text-secondary">Pie Visualization</figcaption>
                            </figure>
                            <figure className="w-[90%] md:w-[40%] h-[40vh] md:h-full mt-6 md:mt-0 rounded-lg shadow-md border border-background-light p-2">
                                <ReactApexChart width="100%" height="100%" series={answerRateChart.series} type="radialBar" options={answerRateChart} />
                            </figure>
                        </div>
                </section>
            </div>
        </>
    )
}
