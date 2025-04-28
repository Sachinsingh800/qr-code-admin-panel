import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <AppBar 
      position="static"
      sx={{ 
        backgroundColor: 'white', 
        color: 'black',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="back"
          sx={{ mr: 2 }}
          onClick={handleGoBack}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;