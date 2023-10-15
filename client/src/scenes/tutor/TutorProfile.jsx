import React from "react";
import {
  Button,
  Container,
  Paper,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";

const TutorProfile = () => {
  const aboutInfo = [{ label: "Name", value: "Yasir " }];
  const experienceInfo = [{ title: "BSC", date: "12.02.2000" }];
  const educationInfo = [{ title: "BSC", date: "12.02.2000" }];
  return (
    <Container maxWidth="lg" sx={{ marginTop: 5 }}>
      <Paper
        elevation={3}
        sx={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)" }}
      >
        <Container>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            p={2}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              example profile
            </Typography>
            <Button
              sx={{ display: { xs: "block", md: "none" }, background: "white" }}
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                width="24"
                height="24"
              >
                <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"></path>
              </svg>
            </Button>
          </Grid>
          <Grid container justifyContent="space-between">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Jane Doe
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Owner at Her Company Inc.
              </Typography>
              <Typography variant="body1" sx={{ color: "white" }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reprehenderit, eligendi dolorum sequi illum qui unde aspernatur
                non deserunt.
              </Typography>
              <List
                sx={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "& li": { padding: 2 },
                }}
              >
                <ListItem>
                  <ListItemText primary="Status" />
                  <span>
                    <span
                      sx={{
                        background: "green.500",
                        padding: 1,
                        color: "white",
                        borderRadius: 2,
                        fontSize: 14,
                      }}
                    >
                      Active
                    </span>
                  </span>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Member since" />
                  <span>Nov 07, 2016</span>
                </ListItem>
              </List>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid white",
                  "& img": { width: "100%", height: "100%" },
                }}
                src="https://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg"
                alt="Profile Image"
              />
            </Grid>
          </Grid>
        </Container>
      </Paper>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Similar Profiles
              </Typography>
              <Grid container spacing={2} mt={2}>
                {similarProfiles.map((profile, index) => (
                  <Grid item xs={4} key={index}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        border: "2px solid primary.main",
                        "& img": { width: "100%", height: "100%" },
                      }}
                      src={profile.image}
                      alt={profile.name}
                    />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "primary.main", mt: 1 }}
                    >
                      {profile.name}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid> */}
          <Grid item xs={12} md={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    About
                  </Typography>
                  <List>
                    {aboutInfo.map((info, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={info.label}
                          secondary={info.value}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Button variant="contained" sx={{ width: "100%", mt: 2 }}>
                    Show Full Information
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Experience
                  </Typography>
                  <List>
                    {experienceInfo.map((info, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={info.title}
                          secondary={info.date}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                    Education
                  </Typography>
                  <List>
                    {educationInfo.map((info, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={info.title}
                          secondary={info.date}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};

export default TutorProfile;

const similarProfiles = [
  {
    name: "Kojstantin",
    image:
      "https://cdn.australianageingagenda.com.au/wp-content/uploads/2015/06/28085920/Phil-Beckett-2-e1435107243361.jpg",
  },
  {
    name: "James",
    image: "https://avatars2.githubusercontent.com/u/24622175?s=60&v=4",
  },
  {
    name: "Natie",
    image:
      "https://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg",
  },
];
