// components/BarChart.js
import React, { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@emotion/react";
import dayjs from "dayjs";
import { Box } from "@mui/material";

const BarChart = ({ data, keys, indexby }) => {
  const theme = useTheme();

  console.log({ data });
  return (
    <Box height="70vh">
      <ResponsiveBar
        data={data}
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
        keys={keys}
        indexBy={indexby}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: "nivo" }}
        axisBottom={{
          format: (value) => value,
          tickRotation: 90,
          legend: "Date",
          offset: 40, // Adjust the offset to create more space
          tickSize: 5, // Increase tick size for better readability
          tickPadding: 10, // Add padding between ticks and labels
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
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
  );
};

export default BarChart;
