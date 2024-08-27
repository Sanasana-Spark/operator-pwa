import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
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
      case '/newtrips':
        return 2;
      default:
        return 1; // Default to 'Drive' if no match
    }
  };

  const value = getValueFromPath(location.pathname);

  return (
    <BottomNavigation
      value={value}
      style={{ width: '100%', position: 'fixed', bottom: 0 }}
    >
      <BottomNavigationAction
        component={LinkWrapper}
        to="/history"
        label="History"
        icon={<HistoryIcon />}
      />
      <BottomNavigationAction
        component={LinkWrapper}
        to="/drive"
        label="Drive"
        icon={<DirectionsCarIcon />}
      />
      <BottomNavigationAction
        component={LinkWrapper}
        to="/newtrips"
        label="New Trips"
        icon={<TripOriginIcon />}
      />
    </BottomNavigation>
  );
};

export default BottomBar;
