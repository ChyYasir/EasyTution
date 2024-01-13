import React, { useState } from "react";
import {
  Container,
  Paper,
  Avatar,
  Button,
  Tab,
  Tabs,
  Typography,
  Box,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  MenuItem,
  Autocomplete,
  CircularProgress,
  Rating,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import {
  useGetAllLocationsQuery,
  useGetAllSubjectsQuery,
  useGetTutorQuery,
  useUpdateTutorMutation,
  useUpdateTutorProfileMutation,
} from "../../state/api";
import { Controller, useForm } from "react-hook-form";
import Header from "../../components/Header";
import AvailabilitySchedule from "./AvailabilitySchedule";

const UpdateProfile = ({ tutor }) => {
  const { data: allSubjects, isLoading: LoadingSubjects } =
    useGetAllSubjectsQuery();
  const { data: allLocations, isLoading: LoadingLocations } =
    useGetAllLocationsQuery();
  const [open1, setOpen1] = useState(false);

  const handleClickOpen = () => {
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

  const [updateTutor] = useUpdateTutorProfileMutation();
  console.log(tutor._id);
  const tutor_id = tutor._id;
  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    console.log({ formData });
    try {
      await updateTutor({ id: tutor_id, updatedFields: formData }).unwrap();
      alert("Tutor Updated Successfully!!!");
      window.location.reload();
      // reset();
    } catch (error) {
      // console.log(error);
      alert("Failed to Update tutor");
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
  // console.log({ tutor });
  return (
    <>
      <Container component="main">
        <div style={{ marginTop: "2rem" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOpen}
          >
            Edit Profile
          </Button>
          <Dialog open={open1} onClose={handleClose1}>
            <DialogTitle>Update Profile Info</DialogTitle>
            <DialogContent>
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
                      defaultValue={tutor.name}
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
                      defaultValue={tutor.phoneNumber}
                      rules={{ required: "Phone Number is required" }}
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
                      defaultValue={tutor.educationBoard}
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
                      defaultValue={tutor.gender}
                      rules={{ required: "Gender is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Gender"
                          variant="outlined"
                          fullWidth
                          error={!!errors.gender}
                          helperText={
                            errors.gender ? errors.gender.message : ""
                          }
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
                          defaultValue={tutor.preferredSubjects}
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
                      defaultValue={tutor.upToClass}
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
                          defaultValue={tutor.preferredLocations}
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
                  <Grid item xs={12}>
                    <Controller
                      name="emergencyPhoneNumber"
                      control={control}
                      defaultValue={tutor.emergencyPhoneNumber}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Emergency Contact Number"
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
                    {isSubmitting ? "Updating..." : "Update Tutor"}
                  </Button>
                </DialogActions>
                {/* </Paper> */}
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </>
  );
};

const UpdateEducation = ({ tutor }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  const [updateTutor] = useUpdateTutorMutation();
  const tutor_id = tutor._id;

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateTutor({ id: tutor_id, updatedFields: formData }).unwrap();
      alert("Tutor's Education Info Updated Successfully!!!");
      window.location.reload();
    } catch (error) {
      alert("Failed to Update Tutor's Education Info");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Container component="main">
        <div style={{ marginTop: "2rem" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOpen}
          >
            Update Education
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <Box m="1rem 2rem">
              <Header title={"Update Education Info"} />

              <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2} sx={{ marginTop: "1.5rem" }}>
                    <Grid item xs={12}>
                      <Controller
                        name="oLevelSchool"
                        control={control}
                        defaultValue={tutor.oLevelSchool}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="O Level School"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="oLevelResult"
                        control={control}
                        defaultValue={tutor.oLevelResult}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="O Level Result"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="aLevelSchool"
                        control={control}
                        defaultValue={tutor.aLevelSchool}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="A Level School"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="aLevelResult"
                        control={control}
                        defaultValue={tutor.aLevelResult}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="A Level Result"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="universityName"
                        control={control}
                        defaultValue={tutor.universityName}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="University Name"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="department"
                        control={control}
                        defaultValue={tutor.department}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Department"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="semester"
                        control={control}
                        defaultValue={tutor.semester}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Semester"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="cgpa"
                        control={control}
                        defaultValue={tutor.cgpa}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="CGPA"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="presentAddress"
                        control={control}
                        defaultValue={tutor.presentAddress}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Present Address"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="otherDetails"
                        control={control}
                        defaultValue={tutor.otherDetails}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Other Details"
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
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="error"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update Education Info"}
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

const Profile = () => {
  const params = useParams();

  // console.log(params.id);
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [hovered, setHovered] = useState(false);
  console.log(params.id);
  const { data, isLoading, isError } = useGetTutorQuery(params.id);
  console.log(data);
  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const ProfileInfo = [
    {
      label: "Tutor ID",
      content: `${data?._id}`,
    },
    {
      label: "Name",
      content: `${data?.name}`,
    },
    {
      label: "Phone Number",
      content: `${data?.phoneNumber}`,
    },
    {
      label: "Gender",
      content: `${data?.gender}`,
    },
    {
      label: "Education Board",
      content: `${data?.educationBoard}`,
    },
    {
      label: "Preferred Subjects",
      content: `${data?.preferredSubjects}`,
    },
    {
      label: "Up To Class",
      content: `${data?.upToClass}`,
    },
    {
      label: "Preferred Locations",
      content: `${data?.preferredLocations}`,
    },
  ];
  const EducationInfo = [
    {
      label: "O Level School",
      content: `${data?.oLevelSchool}`,
    },
    {
      label: "O Level Result",
      content: `${data?.oLevelResult}`,
    },
    {
      label: "A Level School",
      content: `${data?.aLevelSchool}`,
    },
    {
      label: "A Level Result",
      content: `${data?.aLevelResult}`,
    },
    {
      label: "University Name",
      content: `${data?.universityName}`,
    },
    {
      label: "Department",
      content: `${data?.department}`,
    },
    {
      label: "Semester",
      content: `${data?.semester}`,
    },
    {
      label: "CGPA",
      content: `${data?.cgpa}`,
    },
    {
      label: "Other Details",
      content: `${data?.otherDetails}`,
    },
  ];

  const statsInfo = [
    {
      label: "Number of Not Confirmed offers",
      content: `${data?.notConfirmedOffersCount}`,
    },
    {
      label: "Number of Not Confirmed offers",
      content: `${data?.confirmedOffers}`,
    },
  ];

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

  const averageStars = data.averageStars;
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            style={{
              padding: "3%",
              marginTop: "3%",
              marginBottom: "3%",
              borderRadius: "0.5rem",
              background: theme.palette.background.alt,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                position: "relative",
              }}
            >
              <Box
                style={{ textAlign: "center", position: "relative" }}
                className="profile-img"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Avatar
                  alt="Profile Picture"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog"
                  sx={{ width: 200, height: 200, borderRadius: 0 }}
                />
                {hovered && (
                  <label
                    style={{
                      position: "absolute",
                      overflow: "hidden",
                      width: "100%",
                      height: "100%",
                      // transform: "translateX(-50%)",
                      border: "none",
                      borderRadius: 0,
                      fontSize: "15px",
                      background: "#212529b8",
                      bottom: "0",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      // left: "15%",
                    }}
                  >
                    Change Photo
                    <input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      style={{
                        position: "absolute",
                        opacity: 0,
                        right: 0,
                        top: 0,
                      }}
                    />
                    {/* <PhotoCamera fontSize="large" /> */}
                  </label>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            style={{
              padding: "3%",
              marginTop: "3%",
              marginBottom: "3%",
              borderRadius: "0.5rem",
              background: theme.palette.background.alt,
            }}
          >
            <Rating
              name="read-only"
              value={averageStars}
              readOnly
              size="large"
              precision={0.1}
            />
            <Box sx={{ marginBottom: "1rem" }}>
              <div className="profile-head">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  centered
                  indicatorColor="secondary"
                >
                  <Tab
                    label="Profile"
                    sx={{
                      fontWeight: "bold",
                    }}
                    style={{
                      color:
                        value === 0
                          ? theme.palette.secondary[300]
                          : theme.palette.secondary[600],
                    }}
                  />
                  <Tab
                    label="Education"
                    sx={{
                      fontWeight: "bold",
                    }}
                    style={{
                      color:
                        value === 1
                          ? theme.palette.secondary[300]
                          : theme.palette.secondary[600],
                    }}
                  />
                  <Tab
                    label="Stats"
                    sx={{
                      fontWeight: "bold",
                    }}
                    style={{
                      color:
                        value === 2
                          ? theme.palette.secondary[300]
                          : theme.palette.secondary[600],
                    }}
                  />
                  <Tab
                    label="Schedule"
                    sx={{
                      fontWeight: "bold",
                    }}
                    style={{
                      color:
                        value === 3
                          ? theme.palette.secondary[300]
                          : theme.palette.secondary[600],
                    }}
                  />
                </Tabs>
              </div>
            </Box>
            <Box className="profile-content">
              {value === 0 && (
                <Box>
                  {ProfileInfo.map(({ label, content }) => {
                    return (
                      <Box>
                        <Grid
                          container
                          spacing={2}
                          sx={{ marginBottom: "0.5rem" }}
                        >
                          <Grid item xs={6}>
                            <Typography
                              variant="h6"
                              style={{ fontWeight: 600 }}
                            >
                              {label}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="h6">{content}</Typography>
                          </Grid>
                        </Grid>
                        <Divider />
                      </Box>
                    );
                  })}
                  <UpdateProfile tutor={data} />
                </Box>
              )}
              {value === 1 && (
                <Box>
                  {EducationInfo.map(({ label, content }) => {
                    return (
                      <Box>
                        <Grid
                          container
                          spacing={2}
                          sx={{ marginBottom: "0.5rem" }}
                        >
                          <Grid item xs={6}>
                            <Typography
                              variant="h6"
                              style={{ fontWeight: 600 }}
                            >
                              {label}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="h6">{content}</Typography>
                          </Grid>
                        </Grid>
                        <Divider />
                      </Box>
                    );
                  })}
                  <UpdateEducation tutor={data} />
                </Box>
              )}
              {value === 2 && (
                <Box>
                  {statsInfo.map(({ label, content }) => {
                    return (
                      <Box>
                        <Grid
                          container
                          spacing={2}
                          sx={{ marginBottom: "0.5rem" }}
                        >
                          <Grid item xs={6}>
                            <Typography
                              variant="h6"
                              style={{ fontWeight: 600 }}
                            >
                              {label}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="h6">{content}</Typography>
                          </Grid>
                        </Grid>
                        <Divider />
                      </Box>
                    );
                  })}
                  {/* <UpdateEducation tutor={data} /> */}
                </Box>
              )}
              {value === 3 && (
                <Box>
                  <AvailabilitySchedule tutor={data} />
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
