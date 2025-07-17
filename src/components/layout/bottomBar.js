import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import HistoryIcon from '@mui/icons-material/History';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TripOriginIcon from '@mui/icons-material/TripOrigin';

const LinkWrapper = React.forwardRef((props, ref) => (
  <Link ref={ref} {...props} />
));

const BottomBar = () => {
  const location = useLocation();

  const getValueFromPath = (path) => {
    switch (path) {
      case '/history':
        return 0;
      case '/drive':
        return 1;
      case '/':
        return 2;
      default:
        return 1; // Default to 'Drive' if no match
    }
  };

  const value = getValueFromPath(location.pathname);

  return (
    <Box sx={{ width: '100vw', position: 'fixed', bottom: 0 }}>

  
    <BottomNavigation
      showLabels
      value={value}
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
      }}
      // style={{ width: '100%', position: 'fixed', bottom: 0 }}
    >
      <BottomNavigationAction
        component={LinkWrapper}
        to="/history"
        label="History"
        icon={<HistoryIcon />}
        sx={{'&.Mui-selected': {
          color: 'var(--secondary-color)'
        }}}
      />
      <BottomNavigationAction
        component={LinkWrapper}
        to="/drive"
        label="Drive"
        icon={<DirectionsCarIcon />}
        sx={{'&.Mui-selected': {
          color: 'var(--secondary-color)'
        }}}
      />
      <BottomNavigationAction
        component={LinkWrapper}
        to="/"
        label="New Trips"
        icon={<TripOriginIcon />}
        sx={{'&.Mui-selected': {
          color: 'var(--secondary-color)'
        }}}
      />
    </BottomNavigation>
    </Box>
  );
};

export default BottomBar;
