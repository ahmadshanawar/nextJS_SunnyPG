"use client";
import Loader from "react-js-loader";
import { FaUsers } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TennantsCardProps {
  activeTennants: number;
  vacancies: number;
  loading: boolean;
}

const TennantsCard = ({ activeTennants, vacancies, loading }: TennantsCardProps) => {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState<number[]>([]);

  useEffect(() => {
    setChartOptions({
      chart: {
        type: "radialBar",
      },
      grid: {
        padding: {
          top: 0,
          right: 0,
          bottom: 20,
          left: 0,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: {
            margin: 115,
            size: "50%",
          },
          track: {
            background: "#e7e7e7",
            strokeWidth: "97%",
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: "#444",
              opacity: 1,
              blur: 2,
            },
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: "12px",
            },
            value: {
              show: true,
              fontSize: "16px",
            },
            total: {
              show: true,
              fontSize: "16px",
              label: "Total",
              formatter: function () {
                return activeTennants + vacancies;
              },
            },
          },
        },
      },
      labels: ["Active Tennants"],
    });

    const percentage = Math.round(
      (activeTennants / (activeTennants + vacancies)) * 100
    );
    setChartSeries([percentage < 0 ? 0 : percentage]);
  }, [activeTennants, vacancies]);

  return (
    <div className="my-2 mt-10 bg-white shadow-md rounded-lg p-4 w-full max-w-md mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader
            type="hourglass"
            bgColor={"#7c3ab3"}
            color={"#828282"}
            title={"Loading..."}
            size={60}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-row items-center">
            <FaUsers className="text-blue-600 text-4xl mr-2" />
            <div>
              <div className="text-lg text-gray-700 font-semibold -mb-1">
                Occupancy
              </div>
              <div className="text-sm text-gray-500">as of today</div>
            </div>
          </div>
          <div className="mb-2 h-40">
            {chartSeries && (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="radialBar"
                height={250}
              />
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-2xl font-bold">
              {activeTennants} <span className="text-sm font-medium">Active</span>
            </div>
            <div className="h-6 border-l border-gray-300 mx-4"></div>
            <div className="text-2xl font-bold">
              {vacancies} <span className="text-sm font-medium">Vacancies</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TennantsCard;
