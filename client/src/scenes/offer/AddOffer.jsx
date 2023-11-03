import { useTheme } from "@emotion/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  useAddOfferMutation,
  useGetAllLocationsQuery,
  useGetAllSubjectsQuery,
} from "../../state/api";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import { validatePhoneNumber } from "../../components/validation";

const AddOffer = () => {
  const theme = useTheme();

  const { data: allSubjects, isLoading: LoadingSubjects } =
    useGetAllSubjectsQuery();
  const { data: allLocations, isLoading: LoadingLocations } =
    useGetAllLocationsQuery();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [addOffer] = useAddOfferMutation();
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log(data);
    try {
      await addOffer(data).unwrap();
      alert("Offer Added Successfully!!!");
      reset();
    } catch (error) {
      // console.log(error);
      alert("Failed to add this Offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (LoadingSubjects || LoadingLocations) {
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
  const subjects = allSubjects.map((subject) => subject.name);
  const locations = allLocations.map((location) => location.name);
  // const subjects = [];
  // const locations = [];
  return (
    <>
      <Container component="main">
        <Header
          title="Offer Form"
          subtitle="Fill out this form carefully to add a new offer."
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <Paper
              elevation={3}
              style={{
                padding: "16px",
                backgroundColor: theme.palette.background.alt,
              }}
            > */}
          <Grid container spacing={2} sx={{ marginTop: "1.5rem" }}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    name="guardianName"
                    control={control}
                    defaultValue=""
                    rules={{ required: " Guardian name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Guardian Name"
                        variant="outlined"
                        fullWidth
                        error={!!errors.guardianName}
                        helperText={
                          errors.guardianName ? errors.guardianName.message : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="guardianPhoneNumber"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: " Guardian's Phone Number is required",
                      validate: validatePhoneNumber,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Guardian's Phone Number"
                        variant="outlined"
                        fullWidth
                        error={!!errors.guardianPhoneNumber}
                        helperText={
                          errors.guardianPhoneNumber
                            ? errors.guardianPhoneNumber.message
                            : ""
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    name="class"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Class information is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Class"
                        variant="outlined"
                        fullWidth
                        error={!!errors.class}
                        helperText={errors.class ? errors.class.message : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="educationBoard"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Education Board"
                        variant="outlined"
                        fullWidth
                      >
                        <MenuItem value="Cambridge">Cambridge</MenuItem>
                        <MenuItem value="Edexcel">Edexcel</MenuItem>
                        <MenuItem value="IBA">IBA</MenuItem>
                        <MenuItem value="National Curriculam">
                          National Curriculam
                        </MenuItem>
                        {/* Add more options as needed */}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="tutorGender"
                control={control}
                defaultValue=""
                rules={{ required: "Tutor Gender is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Preferred Tutor Gender"
                    variant="outlined"
                    fullWidth
                    error={!!errors.gender}
                    helperText={errors.gender ? errors.gender.message : ""}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>

                    {/* Add more options as needed */}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="subjects"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    id="subjects"
                    options={subjects}
                    defaultValue={[]}
                    onChange={(_, newValues) => {
                      setValue("subjects", newValues);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Subjects"
                        variant="outlined"
                        error={!!errors.subjects}
                        helperText={
                          errors.subjects ? errors.subjects.message : ""
                        }
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="daysPerWeek"
                control={control}
                defaultValue=""
                rules={{ required: "Days Per Week information is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Days Per Week"
                    variant="outlined"
                    fullWidth
                    error={!!errors.daysPerWeek}
                    helperText={
                      errors.daysPerWeek ? errors.daysPerWeek.message : ""
                    }
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    // multiple
                    id="location"
                    options={locations}
                    defaultValue={[]}
                    onChange={(_, newValues) => {
                      setValue("location", newValues);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Location"
                        variant="outlined"
                        error={!!errors.location}
                        helperText={
                          errors.location ? errors.location.message : ""
                        }
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{ required: "Address information is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    variant="outlined"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address ? errors.address.message : ""}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="salary"
                control={control}
                defaultValue=""
                rules={{ required: "Salary information is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Salary"
                    variant="outlined"
                    fullWidth
                    error={!!errors.salary}
                    helperText={errors.salary ? errors.salary.message : ""}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ marginTop: "2rem" }}
          >
            {isSubmitting ? "Adding Offer..." : "Add Offer"}
          </Button>

          {/* </Paper> */}
        </form>
      </Container>
    </>
  );
};

export default AddOffer;
