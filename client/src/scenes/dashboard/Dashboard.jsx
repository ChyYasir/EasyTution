import { ChromePicker } from "react-color";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import Header from "../../components/Header";
import { useGetAnalyticsQuery } from "../../state/api";
import { useTheme } from "@emotion/react";
const Dashboard = () => {
  const theme = useTheme();

  const { data: analytics, isLoading } = useGetAnalyticsQuery();
  let base = process.env.BASE_URL;
  console.log({ base });
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
  function formatTimeDifference(milliseconds) {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }
  const averageTimeToConfirm =
    analytics?.totalConfirmedTime / analytics?.numberOfConfirmedOffers;

  let offerConfirmRate = (
    (analytics?.numberOfConfirmedOffers / analytics?.totalNumberOfOffers) *
    100
  ).toFixed(2);
  let retentionRate = (
    (analytics?.numberOfRepeatedGuardians / analytics?.totalNumberOfOffers) *
    100
  ).toFixed(2);
  // console.log({ analytics });
  const dashboardAnalytics = [
    {
      label: "Number of Available Offers",
      content: `${analytics?.numberOfAvailableOffers}`,
      size: "h1",
    },
    {
      label: "Number of Pending Offers",
      content: `${analytics?.numberOfPendingOffers}`,
      size: "h1",
    },
    {
      label: "Total Number of Offers",
      content: `${analytics?.totalNumberOfOffers}`,
      size: "h1",
    },
    {
      label: "Number of Confirmed Offers",
      content: `${analytics?.numberOfConfirmedOffers}`,
      size: "h1",
    },
    {
      label: "Retention Rate",
      content: `${retentionRate}%`,
      size: "h1",
    },
    {
      label: "Average Time To Confirm",
      content: formatTimeDifference(averageTimeToConfirm),
      size: "h5",
    },
    {
      label: "Offer Confirm Rate",
      content: `${offerConfirmRate}%`,
      size: "h1",
    },
    {
      label: "Total Fee Taken",
      content: `${analytics?.totalFeeTaken}৳`,
      size: "h1",
    },
    {
      label: "Number of Male Tutors",
      content: `${analytics?.numberOfMaleTutors}`,
      size: "h1",
    },
    {
      label: "Number of Female Tutors",
      content: `${analytics?.numberOfFemaleTutors}`,
      size: "h1",
    },
  ];
  return (
    <Box m="1.5rem 2.5rem">
      <Box m="1rem">
        <Header title={"DASHBOARD"}></Header>
      </Box>
      {/* <Addlocation locations={locationNames} /> */}

      <Grid container spacing={2}>
        {dashboardAnalytics.map((information, index) => (
          <Grid item xs={12} sm={4} md={3} key={index}>
            {/* Render your location component here */}
            {/* For example: <locationItem location={location} /> */}
            <Box
              sx={{
                padding: "10%",
                borderRadius: "0.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%", // Set a fixed height (adjust as needed)
                width: "100%", // Set a fixed width (adjust as needed)
                background: theme.palette.secondary[300],
                color: "black",
              }}
            >
              <Typography
                variant={information.size}
                sx={{
                  textAlign: "center", // Center-align the text
                  fontWeight: "bold",
                }}
              >
                {information.content}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center", // Center-align the text
                }}
              >
                {information.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
