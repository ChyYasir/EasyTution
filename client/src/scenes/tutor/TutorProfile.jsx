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
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import { useGetTutorQuery } from "../../state/api";

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
  ];
  if (isLoading) {
    return <div>Loading...</div>;
  }
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

              {/* <Box>
                <Button variant="outlined">Edit Profile</Button>
              </Box> */}
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
            <Box>
              <div className="profile-head">
                <Typography variant="h5">Kshiti Ghelani</Typography>
                <Typography variant="h6">Web Developer and Designer</Typography>
                <Typography>
                  RANKINGS: <span>8/10</span>
                </Typography>
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
                    label="Timeline"
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
                    label="Education"
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
                </Box>
              )}
              {value === 1 && (
                <div>
                  <div className="row">
                    <div className="col-md-6">
                      <Typography variant="body1">Experience</Typography>
                    </div>
                    <div className="col-md-6">
                      <Typography variant="body1">Expert</Typography>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Typography variant="body1">Hourly Rate</Typography>
                    </div>
                    <div className="col-md-6">
                      <Typography variant="body1">10$/hr</Typography>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Typography variant="body1">Total Projects</Typography>
                    </div>
                    <div className="col-md-6">
                      <Typography variant="body1">230</Typography>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Typography variant="body1">English Level</Typography>
                    </div>
                    <div className="col-md-6">
                      <Typography variant="body1">Expert</Typography>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Typography variant="body1">Availability</Typography>
                    </div>
                    <div className="col-md-6">
                      <Typography variant="body1">6 months</Typography>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Typography variant="body1">Your Bio</Typography>
                      <Typography variant="body1">
                        Your detail description
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
