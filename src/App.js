// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AuthPage from './components/AuthPage/AuthPage';
import Dashboard from './components/DashBoard/DashBoard';
import ProfilePage from './components/ProfilePage/ProfilePage';
import UsersTable from './components/UsersTable/UsersTable';
import Detail from './components/Detail/Detail';
import Home from './components/Home/Home';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />  {/* Default route */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="users-table" element={<UsersTable />} />
            <Route path="home" element={<Home />} />  {/* Keep this for direct navigation */}
            <Route path="analytic/:id" element={<Detail />} />
          </Route>
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;