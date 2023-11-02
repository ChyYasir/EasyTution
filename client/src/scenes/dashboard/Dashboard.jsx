import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
const Dashboard = () => {
  return (
    <>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: 10, label: "series A" },
              { id: 1, value: 15, label: "series B" },
              { id: 2, value: 20, label: "series C" },
              { id: 3, value: 20, label: "series D" },
              { id: 4, value: 20, label: "series E" },
              { id: 5, value: 40, label: "series F" },
              { id: 6, value: 50, label: "series G" },
            ],
          },
        ]}
        width={500}
        height={500}
      />
    </>
  );
};

export default Dashboard;
