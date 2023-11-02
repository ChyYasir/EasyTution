import { useTheme } from "@emotion/react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import {
  AdminPanelSettingsOutlined,
  CalendarMonthOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  Groups2Outlined,
  HomeOutlined,
  PieChartOutlined,
  PointOfSaleOutlined,
  PublicOutlined,
  ReceiptLongOutlined,
  SettingsOutlined,
  ShoppingCartOutlined,
  TodayOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
const navItems = [
  {
    text: "Dashboard",
    url: "dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "OFFER MANAGEMENT",
    icon: null,
  },
  {
    text: "Add Offer",
    url: "addoffer",
    icon: <AddIcon />,
  },
  {
    text: "Available Offers",
    url: "availableoffers",
    icon: <Groups2Outlined />,
  },
  {
    text: "Pending Offers",
    url: "pendingoffers",
    icon: <ReceiptLongOutlined />,
  },
  {
    text: "Confirmed Offers",
    url: "confirmedoffers",
    icon: <PublicOutlined />,
  },
  {
    text: "TUTOR MANAGEMENT",
    icon: null,
  },
  {
    text: "Add Tutor",
    url: "addtutor",
    icon: <AddIcon />,
  },
  {
    text: "All Tutors",
    url: "alltutors",
    icon: <TodayOutlined />,
  },
  {
    text: "SYSTEM MANAGEMENT",
    icon: null,
  },
  {
    text: "All Subjects",
    url: "allsubjects",
    icon: <AdminPanelSettingsOutlined />,
  },
  {
    text: "All Locations",
    url: "alllocations",
    icon: <TrendingUpOutlined />,
  },
  {
    text: "IMPORTANT INFO",
    icon: null,
  },
];
const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  useEffect(() => {
    console.log(pathname);
    setActive(pathname.split("/")[1]);
  }, [pathname]);
  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
              // Hide the scroll bar in WebKit browsers.
              overflow: "scroll",
              scrollbarWidth: "none", // Hide the scroll bar in Firefox.
              "-ms-overflow-style": "none", // Hide the scroll bar in IE/Edge.
              "&::-webkit-scrollbar": {
                width: "0.4em", // Set the width of the invisible scroll bar.
                display: "none", // Hide the scroll bar in WebKit browsers.
              },
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold">
                    EASY TUTION
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>

            <List>
              {navItems.map(({ text, icon, url }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                {
                  /* const lcText = text.toLowerCase(); */
                }

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${url}`);
                        setActive(url);
                      }}
                      sx={{
                        backgroundColor:
                          active === url
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === url
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === url
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === url && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          {/* <Box
            position="absolute"
            // bottom="2rem"
            bottom="0"
            sx={{ backgroundColor: theme.palette.background.alt }}
          >
            <Divider />
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              <Box
                component="img"
                alt="profile"
                // src={}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.occupation}
                </Typography>
              </Box>
              <SettingsOutlined
                sx={{
                  color: theme.palette.secondary[300],
                  fontSize: "25px ",
                }}
              />
            </FlexBetween>
          </Box> */}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
