
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
});

const FeatureItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  background: "rgba(255, 255, 255, 0.05)",
  marginBottom: theme.spacing(2),
}));

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

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
        sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
      >
        <Paper
          elevation={24}
          sx={{
            display: "flex",
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
            background: "linear-gradient(to right, #001e3c 0%, #0a1929 100%)",
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
                  p: 6,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ mb: 4 }}>
                  <QrCodeScanner
                    sx={{ fontSize: 40, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    QRScanner+
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Premium QR Code Solution for Professionals
                  </Typography>
                </Box>

                <FeatureItem>
                  <QrCodeScanner sx={{ color: "primary.main" }} />
                  <Box>
                    <Typography variant="subtitle1">
                      Advanced Scanning
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Instant recognition with AI-powered technology
                    </Typography>
                  </Box>
                </FeatureItem>

                <FeatureItem>
                  <Security sx={{ color: "primary.main" }} />
                  <Box>
                    <Typography variant="subtitle1">
                      Enterprise Security
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Military-grade encryption for all your data
                    </Typography>
                  </Box>
                </FeatureItem>

                <FeatureItem>
                  <Palette sx={{ color: "primary.main" }} />
                  <Box>
                    <Typography variant="subtitle1">Custom Design</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Fully customizable QR code templates
                    </Typography>
                  </Box>
                </FeatureItem>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 6,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  background: "rgba(0, 30, 60, 0.9)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                  {isLogin ? "Welcome Back" : "Get Started"}
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                      py: 1.5,
                      "&:hover": {
                        transform: "translateY(-2px)",
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

                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <MuiLink
                    component="button"
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    sx={{
                      color: "text.secondary",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {isLogin
                      ? "Don't have an account? Register now"
                      : "Already registered? Sign in here"}
                  </MuiLink>
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
