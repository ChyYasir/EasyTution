import React from "react";
import { useGetAllLocationsQuery } from "../../state/api";
import { Box, CircularProgress, Paper, Grid } from "@mui/material";
import NivoResponsivePie from "../../components/NivoResponsivePie";
import Header from "../../components/Header";

const OfferVLocation = () => {
  const { data: locations, isLoading } = useGetAllLocationsQuery();

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
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const formattedData = locations.map((item) => ({
    id: item.name,
    label: item.name,
    value: item.offerCount,
    color: item.color,
  }));

  const formattedDataAvailable = locations.map((item) => ({
    id: item.name,
    label: item.name,
    value: item.availableOfferCount,
    color: item.color,
  }));

  return (
    <Box m="1.5rem 2.5rem">
      <Grid container spacing={2}>
        <Grid item xs={6}>
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
            <Box height="75vh">
              <Header title={"Available Offers "} />
              <NivoResponsivePie data={formattedDataAvailable} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6}>
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
            <Box marginBottom={"20px"} height="75vh">
              <Header title={"Total Offers "} />
              <NivoResponsivePie data={formattedData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OfferVLocation;
