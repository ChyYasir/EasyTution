import React, { useMemo, useState } from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";

import { useGetMonthlyDataQuery } from "../../state/api";
import Header from "../../components/Header";

const MonthlySales = () => {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Initialize with the current year

  const { data: Data, error, isLoading } = useGetMonthlyDataQuery(selectedYear); // Use the selectedYear to fetch data

  const handleChangeYear = (event) => {
    setSelectedYear(event.target.value);
  };

  const [formattedData] = useMemo(() => {
    if (!Data) return [];

    const requiredData = {
      id: "monthlySale",
      color: theme.palette.secondary[600],
      data: [],
    };

    Data?.monthlyData?.map((value) => {
      requiredData.data.push({
        x: value.month.slice(0, 3),
        y: value.totalFeeTaken,
      });
    });
    const formattedData = [requiredData];
    return [formattedData];
  }, [Data]); // eslint-disable-line react-hooks/exhaustive-deps

  console.log({ formattedData });

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MONTHLY SALES" subtitle="Chart of monthlysales" />
      <FormControl>
        <InputLabel>Year</InputLabel>
        <Select value={selectedYear} onChange={handleChangeYear}>
          {/* Add options for the years you want to make available */}
          <MenuItem value={2023}>2023</MenuItem>
          <MenuItem value={2022}>2022</MenuItem>
          {/* Add more years as needed */}
        </Select>
      </FormControl>
      <Box height="80vh">
        {/* {error && <p>Error: {error.message}</p>} */}

        <ResponsiveLine
          data={formattedData}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: theme.palette.secondary[200],
                },
              },
              legend: {
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
              ticks: {
                line: {
                  stroke: theme.palette.secondary[200],
                  strokeWidth: 1,
                },
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
            },
            legends: {
              text: {
                fill: theme.palette.secondary[200],
              },
            },
            tooltip: {
              container: {
                color: "#000",
              },
            },
          }}
          colors={{ datum: "color" }}
          margin={{ top: 50, right: 50, bottom: 70, left: 100 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          yFormat=" >-.2f"
          // curve="catmullRom"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Month",
            legendOffset: 60,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Total Taken Fee",
            legendOffset: -70,
            legendPosition: "middle",
          }}
          enableGridX={false}
          // enableGridY={false}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "top-right",
              direction: "column",
              justify: false,
              translateX: 50,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default MonthlySales;
