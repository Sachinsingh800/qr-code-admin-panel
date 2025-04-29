import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Paper,
  Link as MuiLink,
  Grid,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  styled,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  QrCodeScanner,
  Security,
  Palette,
} from "@mui/icons-material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ff88",
      contrastText: "#000",
    },
    secondary: {
      main: "#7c4dff",
    },
    background: {
      default: "#0a1929",
      paper: "#001e3c",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#a0a0a0",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "&.Mui-focused fieldset": {
              borderWidth: "1px",
              borderColor: "#00ff88",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.3s ease",
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const FeatureItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  background: "rgba(255, 255, 255, 0.05)",
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
    gap: theme.spacing(1),
  },
}));

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const validateForm = () => {
    const { email, password } = formData;
    setError("");

    if (!email || !password) return setError("All fields are required");
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      return setError("Invalid email");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const url = `http://13.203.219.119:3001/admin/${
        isLogin ? "logIn" : "register"
      }`;
      const { data } = await axios.post(url, formData);

      if (isLogin) {
        Cookies.set("adminToken", data.token, { expires: 7, path: "/" });
        navigate("/dashboard");
      } else {
        setIsLogin(true);
        setError("Registration successful! Please login.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container
        maxWidth="lg"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          py: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Paper
          elevation={24}
          sx={{
            display: "flex",
            width: "100%",
            minHeight: { xs: "auto", md: "600px" },
            borderRadius: { xs: 2, md: 4 },
            overflow: "hidden",
            background: "rgba(0, 30, 60, 0.9)",
          }}
        >
          <Grid container>
            {!isMobile && (
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 30, 60, 0.8) 100%)",
                  p: { xs: 2, md: 4 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ mb: { xs: 2, md: 4 } }}>
                  <QrCodeScanner
                    sx={{
                      fontSize: { xs: 32, md: 40 },
                      color: "primary.main",
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                      mb: 1,
                    }}
                  >
                    QRScanner & Generator
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{
                      fontSize: { xs: "0.875rem", md: "1rem" },
                    }}
                  >
                    Scan, Create, and Manage QR Codes Effortlessly
                  </Typography>
                </Box>

                {[
                  {
                    icon: <QrCodeScanner sx={{ color: "primary.main" }} />,
                    title: "Smart QR Scanning",
                    text: "Instant scan from images, PDFs, or live camera feed",
                  },
                  {
                    icon: <Security sx={{ color: "primary.main" }} />,
                    title: "Secure Sharing",
                    text: "Password-protected QR codes with expiration dates",
                  },
                  {
                    icon: <Palette sx={{ color: "primary.main" }} />,
                    title: "Multi-Format Export",
                    text: "Save QR codes as PNG, PDF, or embed in DOC files",
                  },
                ].map((feature, index) => (
                  <FeatureItem key={index}>
                    {feature.icon}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontSize: { xs: "0.875rem", md: "1rem" },
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          fontSize: { xs: "0.75rem", md: "0.875rem" },
                        }}
                      >
                        {feature.text}
                      </Typography>
                    </Box>
                  </FeatureItem>
                ))}
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: { xs: 3, md: 6 },
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  background: "rgba(0, 30, 60, 0.9)",
                }}
              >
                <Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                  >
                    {isLogin ? "Welcome Back" : "Get Started"}
                  </Typography>

                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        fontSize: { xs: "0.875rem", md: "1rem" },
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Email"
                      variant="outlined"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      sx={{ mb: 2 }}
                      InputLabelProps={{ sx: { color: "text.secondary" } }}
                    />

                    <TextField
                      fullWidth
                      margin="normal"
                      label="Password"
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: "text.secondary" }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={{ sx: { color: "text.secondary" } }}
                    />

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      type="submit"
                      disabled={loading}
                      sx={{
                        mt: 3,
                        py: { xs: 1.25, md: 1.5 },
                        fontSize: { xs: "0.875rem", md: "1rem" },
                        "&:hover": {
                          transform: { xs: "none", md: "translateY(-2px)" },
                          boxShadow: "0 8px 24px rgba(0, 255, 136, 0.2)",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress
                          size={24}
                          sx={{ color: "text.primary" }}
                        />
                      ) : isLogin ? (
                        "Sign In"
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </Box>

                  {/* <Box sx={{ mt: 3, textAlign: "center" }}>
                    <MuiLink
                      component="button"
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      sx={{
                        color: "text.secondary",
                        fontSize: { xs: "0.875rem", md: "1rem" },
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {isLogin
                        ? "Don't have an account? Register now"
                        : "Already registered? Sign in here"}
                    </MuiLink>
                  </Box> */}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default AuthPage;
