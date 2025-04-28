// ProfilePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Event as EventIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? "Invalid Date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("adminToken");
        if (!token) {
          navigate("/auth");
          return;
        }

        const { data } = await axios.get(
          "http://13.203.219.119:3001/admin/get",
          {
            headers: {
              "x-admin-token": token, // Fixed header format
            },
          }
        );

        if (data.status) {
          setProfileData(data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            sx={{ width: 80, height: 80, mr: 3, bgcolor: "primary.main" }}
          >
            <LockIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" component="h1">
            Admin Profile
          </Typography>
        </Box>

        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <EmailIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Email"
              secondary={profileData.email}
              secondaryTypographyProps={{ variant: "body1" }}
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <LockIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Role"
              secondary={profileData.role}
              secondaryTypographyProps={{
                variant: "body1",
                textTransform: "capitalize",
              }}
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <EventIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Account Created"
              secondary={formatDate(profileData.createdAt)}
              secondaryTypographyProps={{ variant: "body1" }}
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <UpdateIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Last Updated"
              secondary={formatDate(profileData.updatedAt)}
              secondaryTypographyProps={{ variant: "body1" }}
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
