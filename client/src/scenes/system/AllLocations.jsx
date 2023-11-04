import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";

import { AddCircleOutlined, Book } from "@mui/icons-material";
import {
  useDeleteLocationMutation,
  useGetAllLocationsQuery,
} from "../../state/api";
import Header from "../../components/Header";
import { useTheme } from "@emotion/react";
import { Controller, useForm } from "react-hook-form";
import AddLocation from "./AddLocation";
import ChangeLocationColor from "./ChangeLocationColor";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AllLocations = () => {
  const [open, setOpen] = useState(false);
  const locationId = useRef(null);
  const locationName = useRef(null);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const theme = useTheme();
  const { data: locations, isLoading } = useGetAllLocationsQuery();
  console.log(locations);

  const [deleteLocation] = useDeleteLocationMutation();

  const handleDeleteLocation = async (locationId) => {
    try {
      const response = await deleteLocation(locationId).unwrap();
      alert(`location deleted successfully`);

      window.location.reload();
    } catch (err) {
      console.error("Error deleting lcoation:", err);
    }
  };
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
  const locationNames = locations.map((location) => location.name);

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <Header title={"All Locations"}></Header>
        {/* <Addlocation locations={locationNames} /> */}
        <AddLocation locations={locationNames} />
        <Grid container spacing={2}>
          {locations.map((location, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              {/* Render your location component here */}
              {/* For example: <locationItem location={location} /> */}
              <Box
                sx={{
                  padding: "3%",
                  borderRadius: "0.5rem",
                  display: "flex", // Add this line
                  justifyContent: "space-between",
                  background: theme.palette.background.alt,
                }}
              >
                <Box>
                  <Typography variant="h4">{location.name}</Typography>
                  <ChangeLocationColor location={location} />
                </Box>
                <Button
                  color="error"
                  onClick={() => {
                    locationId.current = location._id;
                    locationName.current = location.name;
                    handleClickOpen();
                  }}
                >
                  <DeleteIcon />
                </Button>
                <Dialog
                  open={open}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>
                    {`Are you sure you want to delete this location named "${locationName.current}"?`}
                  </DialogTitle>
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        // console.log(location._id);
                        handleDeleteLocation(locationId.current);
                      }}
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default AllLocations;
