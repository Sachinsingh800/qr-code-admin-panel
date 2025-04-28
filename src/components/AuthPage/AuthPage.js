// AuthPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
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
  Link as MuiLink
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const { email, password } = formData;
    setError('');

    if (!email || !password) return setError('All fields are required');
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) return setError('Invalid email');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const url = `http://13.203.219.119:3001/admin/${isLogin ? 'logIn' : 'register'}`;
      const { data } = await axios.post(url, formData);
      
      if (isLogin) {
        Cookies.set('adminToken', data.token, { expires: 7, path: '/' });
        navigate('/dashboard');
      } else {
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {isLogin ? 'Admin Login' : 'Admin Sign Up'}
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              variant="outlined"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : isLogin ? 'Login' : 'Register'}
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <MuiLink
              component="button"
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              color="text.secondary"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </MuiLink>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthPage;