import { useTheme } from "@emotion/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAddLocationMutation } from "../../state/api";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import Header from "../../components/Header";

const AddLocation = ({ locations }) => {
  const [open1, setOpen1] = useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const theme = useTheme();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addLocation] = useAddLocationMutation();

  const onSubmit = async (formData) => {
    const location = formData.name;

    const locationName = location.toLowerCase();
    if (location === "") {
      alert("Enter a valid location Name.");
    } else {
      setIsSubmitting(true);
      try {
        const response = await addLocation(formData).unwrap();
        // console.log({ response });
        alert(response.message);
        // alert("location Added Successfully!!!");
        window.location.reload();
      } catch (error) {
        alert("Failed to add this location");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <Container component="main">
        <div
          style={{
            marginTop: "2rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOpen1}
            startIcon={<AddCircleOutline />}
          >
            Add New location
          </Button>
          <Dialog open={open1} onClose={handleClose1}>
            <Box m="1rem 1.5rem">
              <Header title={"Add Location"} />
              <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2} sx={{ marginTop: "1.5rem" }}>
                    <Grid item xs={12}>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Location Name"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <DialogActions sx={{ marginTop: "1rem" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleClose1}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="error"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add Location"}
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Box>
          </Dialog>
        </div>
      </Container>
    </>
  );
};

export default AddLocation;
