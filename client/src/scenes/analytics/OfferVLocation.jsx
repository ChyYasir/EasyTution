import React from "react";
import { useGetAllLocationsQuery } from "../../state/api";
import { Box, CircularProgress } from "@mui/material";
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

  //   console.log({ formattedData });

  return (
    <>
      <Box mt="40px" height="75vh">
        <Header title={"Available Offers "} />
        <NivoResponsivePie data={formattedDataAvailable} />
      </Box>
      <Box mt="40px" height="75vh">
        <Header title={"Total Offers "} />
        <NivoResponsivePie data={formattedData} />
      </Box>
    </>
  );
};

export default OfferVLocation;
