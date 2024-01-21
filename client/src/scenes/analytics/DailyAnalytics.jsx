import React, { useState, useMemo } from "react";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import BarChart from "../../components/BarChart";
import { useGetDailyDataByDateRangeQuery } from "../../state/api";
import dayjs from "dayjs";
import { Box } from "@mui/material";

const DailyAnalytics = () => {
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(dayjs(new Date()));

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  // Memoize the result of the query using useMemo
  const {
    data: dailyData,
    error,
    isLoading,
  } = useGetDailyDataByDateRangeQuery({
    startDate,
    endDate,
  });
  console.log({ dailyData });
  const [formattedData] = useMemo(() => {
    if (!dailyData) return [];

    const formattedData = dailyData.map((item) => ({
      ...item,
      date: dayjs(item.date).format("MM-DD-YYYY"), // Apply desired format
    }));
    return [formattedData];
  }, [dailyData]);
  console.log({ formattedData });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error.message);
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box m="1.5rem 2.5rem">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="Start Date"
            value={startDate}
            disableFuture
            onChange={handleStartDateChange}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            disableFuture
            onChange={handleEndDateChange}
          />
        </DemoContainer>
      </LocalizationProvider>

      {/* Render your BarChart component with dailyData */}
      <BarChart
        data={formattedData}
        keys={["availableOffers", "confirmedOffers", "pendingOffers"]}
        indexby="date"
      />
    </Box>
  );
};

export default DailyAnalytics;
