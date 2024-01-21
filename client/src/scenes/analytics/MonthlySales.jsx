import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";

import {
  useGetAvailableYearsQuery,
  useGetDemoClassSuccessRateQuery,
  useGetMonthlyDataQuery,
} from "../../state/api";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";

const MonthlySales = () => {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Initialize with the current year
  // const [tutorCountData, setTutorCountData] = useState([]);
  const { data: Data, error, isLoading } = useGetMonthlyDataQuery(selectedYear); // Use the selectedYear to fetch data

  const {
    data: availableYears,
    isLoading: yearsLoading,
    error: yearsError,
  } = useGetAvailableYearsQuery();
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
  }, [Data]);
  // eslint-disable-line react-hooks/exhaustive-deps
  const [formattedRateData] = useMemo(() => {
    if (!Data) return [];

    const requiredData = {
      id: "demoClassSuccessRate",
      color: theme.palette.secondary[600],
      data: [],
    };

    Data?.monthlyData?.map((value) => {
      requiredData.data.push({
        x: value.month.slice(0, 3),
        y: (value.confirmedOffers / value.pendingOffers) * 100,
      });
    });
    const formattedRateData = [requiredData];
    return [formattedRateData];
  }, [Data]); // eslint-disable-line react-hooks/exhaustive-deps

  const [tutorCountData] = useMemo(() => {
    if (!Data) return [];

    const tutorCountData = Data?.monthlyData?.map((item) => ({
      month: item.month.slice(0, 3),
      Males: item.maleTutors,
      Females: item.femaleTutors,
      // Apply desired format
    }));
    return [tutorCountData];
  }, [Data]);
  // int-disable-line react-hooks/exhaustive-deps

  // eslint-disable-line react-hooks/exhaustive-deps
  console.log({ tutorCountData });
  // console.log({ Data });
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h2" color="secondary">
          LOADING
        </Typography>
        <CircularProgress color="secondary" />
      </Box>
    );
  }
  return (
    <Box m="1.5rem 2.5rem">
      <FormControl>
        <InputLabel>Year</InputLabel>
        <Select value={selectedYear} onChange={handleChangeYear}>
          {yearsLoading ? (
            <MenuItem value="">Loading years...</MenuItem>
          ) : yearsError ? (
            <MenuItem value="">Error fetching years</MenuItem>
          ) : (
            availableYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {/* First Row: Monthly Sales and Tutor Gender Distribution */}
      {/* Grid Layout */}
      <Grid container spacing={2}>
        {/* Monthly Sales */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              border: "1px solid #ddd",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Header title="MONTHLY SALES" subtitle="Chart of monthly sales" />
            <Box sx={{ flex: 1 }}>
              <LineChart
                formattedData={formattedData}
                leftLegend={"Total Taken Fee"}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Tutor Gender Distribution */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              border: "1px solid #ddd",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Header
              title="TUTOR GENDER DISTRIBUTION"
              subtitle="Monthly distribution of male and female tutors"
            />
            <Box sx={{ flex: 1 }}>
              <BarChart
                data={tutorCountData}
                keys={["Males", "Females"]}
                indexby="month"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Demo Class Success Rate */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{ padding: 2, marginTop: 2, border: "1px solid #ddd" }}
          >
            <Header
              title="DEMO CLASS SUCCESS RATE"
              subtitle="Chart of demo class success rate"
            />
            <LineChart
              formattedData={formattedRateData}
              leftLegend={"Success Rate"}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MonthlySales;
