import { Box, CircularProgress } from "@mui/material";
import React from "react";

const Loading = ({ isLoading }) => {
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
};

export default Loading;
