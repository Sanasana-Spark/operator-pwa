import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeRoundedIcon       from '@mui/icons-material/HomeRounded'
import MapRoundedIcon        from '@mui/icons-material/MapRounded'
import LocalGasStationRoundedIcon from '@mui/icons-material/LocalGasStationRounded'
import PersonRoundedIcon     from '@mui/icons-material/PersonRounded'
import { C } from '../../index'

const BottomBar = () => {
  const navigate     = useNavigate()
  const location = useLocation();

  const getValueFromPath = (path) => {
    switch (path) {
      case '/history':
        return 1;
      case '/drive':
        return 0;
      case '/':
        return 2;
      case '/profile':
        return 3;
      default:
        return 1; // Default to 'Drive' if no match
    }
  };

  const value = getValueFromPath(location.pathname);

  const NAV = [
  { path: '/drive',    label: 'Home',    Icon: HomeRoundedIcon },
  { path: '/history',   label: 'History',   Icon: MapRoundedIcon },
  { path: '/',    label: 'Upcoming',    Icon: LocalGasStationRoundedIcon },
  { path: '/profile', label: 'Profile', Icon: PersonRoundedIcon },
]

  return (
    <BottomNavigation
      value={value}
      onChange={(_, v) => navigate(NAV[v].path)}
      sx={{ flexShrink: 0 }}
      showLabels
      
    >

        {NAV.map((n, i) => (
          <BottomNavigationAction
            key={n.path}
            label={n.label}
            icon={<n.Icon sx={{ fontSize: 22 }} />}
            sx={{
              '& .MuiSvgIcon-root': {
                color: value === i ? C.lime : 'rgba(255,255,255,0.3)',
              },
            }}
          />
        ))}

    </BottomNavigation>

  );
};

export default BottomBar;
