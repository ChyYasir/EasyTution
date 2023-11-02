import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useAddTutorMutation,
  useGetAllLocationsQuery,
  useGetAllSubjectsQuery,
} from "../../state/api";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import { useDispatch } from "react-redux";
import { CheckBox } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { validatePhoneNumber } from "../../components/validation";
const AddTutor = () => {
  const theme = useTheme();
  const { data: allSubjects, isLoading } = useGetAllSubjectsQuery();
  const { data: allLocations } = useGetAllLocationsQuery();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [addTutor] = useAddTutorMutation();
  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    console.log(formData);
    try {
      await addTutor(formData).unwrap();
      alert("Tutor Added Successfully!!!");
      reset();
    } catch (error) {
      // console.log(error);
      alert("Failed to add tutor");
    } finally {
      setIsSubmitting(false);
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
        <Typography variant="h2" color="secondary">
          LOADING
        </Typography>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const subjects = allSubjects.map((subject) => subject.name);
  const locations = allLocations.map((location) => location.name);
  return (
    <>
      <Container component="main">
        <Header
          title="Tutor Form"
          subtitle="Fill out this form carefully to add a new tutor."
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
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ""}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                rules={{
                  required: "Phone Number is required",
                  validate: validatePhoneNumber,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={
                      errors.phoneNumber ? errors.phoneNumber.message : ""
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Controller
                name="gender"
                control={control}
                defaultValue=""
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Gender"
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
                name="preferredSubjects"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    id="preferredSubjects"
                    options={subjects}
                    defaultValue={[]}
                    onChange={(_, newValues) => {
                      setValue("preferredSubjects", newValues);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Preferred Subjects"
                        variant="outlined"
                        error={!!errors.preferredSubjects}
                        helperText={
                          errors.preferredSubjects
                            ? errors.preferredSubjects.message
                            : ""
                        }
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="upToClass"
                control={control}
                defaultValue=""
                rules={{ required: "Class information is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Up to Class"
                    variant="outlined"
                    fullWidth
                    error={!!errors.upToClass}
                    helperText={
                      errors.upToClass ? errors.upToClass.message : ""
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="preferredLocations"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    id="preferredLocations"
                    options={locations}
                    defaultValue={[]}
                    onChange={(_, newValues) => {
                      setValue("preferredLocations", newValues);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Preferred Locations"
                        variant="outlined"
                        error={!!errors.preferredLocations}
                        helperText={
                          errors.preferredLocations
                            ? errors.preferredLocations.message
                            : ""
                        }
                      />
                    )}
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
            {isSubmitting ? "Adding..." : "Add Tutor"}
          </Button>

          {/* </Paper> */}
        </form>
      </Container>
    </>
  );
};

export default AddTutor;
