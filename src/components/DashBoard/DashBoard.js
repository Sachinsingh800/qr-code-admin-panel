import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Divider,
  useMediaQuery,
  Avatar,
  MenuItem,
  Menu,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Logout, Person } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import Cookies from "js-cookie";

const drawerWidth = 280;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for popover menu

  const menuItems = [
    { label: "Home", icon: <HomeIcon />, path: "/dashboard" },
    { label: "Users", icon: <GroupsIcon />, path: "/dashboard/users-table" },
  ];

  const handleLogout = () => {
    Cookies.remove("adminToken");
    navigate("/");
  };

  const drawerContent = (
    <Box>
      <Typography
        variant="h6"
        sx={{
          p: 2,
          fontWeight: "bold",
          textAlign: "center",
          color: "#1976d2",
        }}
      >
        qrScanner and Generator
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item, index) =>
          item.divider ? (
            <Divider key={index} />
          ) : (
            <ListItem
              button
              key={index}
              onClick={() => {
                navigate(item.path);
                setMobileDrawerOpen(false);
              }}
              sx={{
                cursor: "pointer",
                backgroundColor:
                  location.pathname === item.path
                    ? "rgba(255, 0, 0, 0.1)"
                    : "inherit",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? "red" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  style: {
                    color: location.pathname === item.path ? "red" : "inherit",
                    fontWeight:
                      location.pathname === item.path ? "bold" : "normal",
                  },
                }}
              />
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#ffffff",
          color: "#000000",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            qrScanner and Generator
          </Typography>
          <IconButton
            onClick={handleAvatarClick}
            color="none"
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "none",
              gap: 1,
              "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              padding: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "500" }}>
              Admin
            </Typography>
            <Avatar
              alt="User Avatar"
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              elevation: 4,
              sx: {
                borderRadius: "12px",
                overflow: "hidden",
                animation: "fadeIn 0.3s ease-out",
                "& .MuiMenuItem-root": {
                  padding: "10px 20px",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.1)",
                  },
                },
              },
            }}
          >
            <MenuItem onClick={() => navigate("/dashboard/profile")}>
              <ListItemIcon>
                <Person fontSize="small" color="primary" />
              </ListItemIcon>
              My Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleLogout()}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
            },
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 0 : 3, // Remove padding for mobile view
          backgroundColor: "#f4f4f4",
          overflowY: "auto",
          ml: isMobile ? 0 : `${drawerWidth}px`, // Add margin when Drawer is permanent
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
