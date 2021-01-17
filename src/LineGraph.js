import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRation: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridlines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

function LineGraph({ casesType = "cases", ...props }) {
    const [data, setData] = useState({});

    // https://disease.sh/v3/covid-19/historical/all?lastdays=30

    const buildChartData = (data, casesType = "cases") => {
        let chartData = [];
        let lastDataPoint;

        for (let date in data.cases) {
            if (lastDataPoint) {
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint,
                };

                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetch(`https://disease.sh/v3/covid-19/historical/all?lastdays=30
            `)
                .then((response) => response.json())
                .then((data) => {
                    let chartData = buildChartData(data, casesType);
                    setData(chartData);
                });
        };
        fetchData();
    }, [casesType]);

    return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line
                    data={{
                        datasets: [
                            {
                                backgroundColor: () => {
                                    if (casesType === "cases") {
                                        return "rgba(204,16,52,0.6)";
                                    } else if (casesType === "recovered") {
                                        return "rgba(125, 215, 29, 0.6)";
                                    } else {
                                        return "rgba(251, 67, 67, 0.6)";
                                    }
                                },
                                borderColor: () => {
                                    if (casesType === "cases") {
                                        return "rgba(204,16,52,1)";
                                    } else if (casesType === "recovered") {
                                        return "rgba(125, 215, 29, 1)";
                                    } else {
                                        return "rgba(251, 67, 67,1)";
                                    }
                                },
                                data: data,
                            },
                        ],
                    }}
                    options={options}
                />
            )}
        </div>
    );
}

export default LineGraph;
