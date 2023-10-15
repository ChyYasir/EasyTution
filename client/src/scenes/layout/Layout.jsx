import { Box, useMediaQuery } from "@mui/material";

import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const userId = useSelector((state) => state.global.userId);
  // console.log(process.env.REACT_APP_BASE_URL);
  // const { data } = useGetUserQuery(userId);
  // console.log(data);
  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
