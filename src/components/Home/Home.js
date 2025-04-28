import React from 'react';
import { Typography, Box, Grow } from '@mui/material';
import UsersTable from '../UsersTable/UsersTable';

function Home() {
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    setChecked(true);
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Grow in={checked} timeout={1000}>
        <Typography 
          variant="h4" 
          align="center" 
          fontWeight="bold" 
          color="text.primary" 
          gutterBottom
        >
          Welcome back, Admin
        </Typography>
      </Grow>
      <UsersTable />
    </Box>
  );
}

export default Home;
