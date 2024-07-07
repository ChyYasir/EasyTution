import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useAddTutorMutation,
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
} from "@mui/material";
import Header from "../../components/Header";
import { useTheme } from "@emotion/react";

const AddTutor = () => {
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

  const [addTutor] = useAddTutorMutation();

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await addTutor(formData).unwrap();
      alert("Tutor Added Successfully!!!");
      reset();
    } catch (error) {
      alert("Failed to add tutor");
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
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const subjects = allSubjects?.map((subject) => subject?.name);
  const locations = allLocations?.map((location) => location?.name);

  return (
    <>
      <Container component="main">
        <Header
          title="Tutor Form"
          subtitle="Fill out this form carefully to add a new tutor."
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ marginTop: "1.5rem" }}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: "Name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message:
                      "Name can only contain English alphabets and spaces",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ""}
                    InputLabelProps={{
                      style: { color: theme.palette.secondary[100] },
                    }}
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
                  validate: (value) => {
                    const normalizedValue = value.replace(/^\+88/, "");
                    if (!/^[0-9]{11}$/.test(normalizedValue)) {
                      return "Phone Number must be exactly 11 digits (excluding +88 if present)";
                    }
                    return true;
                  },
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
                    InputLabelProps={{
                      style: { color: theme.palette.secondary[100] },
                    }}
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
                    InputLabelProps={{
                      style: { color: theme.palette.secondary[100] },
                    }}
                  >
                    <MenuItem value="Cambridge">Cambridge</MenuItem>
                    <MenuItem value="Edexcel">Edexcel</MenuItem>
                    <MenuItem value="IBA">IBA</MenuItem>
                    <MenuItem value="National Curriculum">
                      National Curriculum
                    </MenuItem>
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
                    InputLabelProps={{
                      style: { color: theme.palette.secondary[100] },
                    }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
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
                        InputLabelProps={{
                          style: { color: theme.palette.secondary[100] },
                        }}
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
                rules={{
                  required: "Class information is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Class can only contain numeric characters",
                  },
                }}
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
                    InputLabelProps={{
                      style: { color: theme.palette.secondary[100] },
                    }}
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
                        InputLabelProps={{
                          style: { color: theme.palette.secondary[100] },
                        }}
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
        </form>
      </Container>
    </>
  );
};

export default AddTutor;
