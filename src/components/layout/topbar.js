import React from "react";
import { UserButton } from "@clerk/clerk-react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logo from "../../assets/logo.png";
import { useAuthContext } from "../onboarding/authProvider";
import Box from "@mui/material/Box";
import Logout from '@mui/icons-material/Logout';
import Grid from '@mui/material/Grid2';


const TopBar = () => {
  const { org_name } = useAuthContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center", width: '100vw', position: "fixed", top: 0, zIndex: 1000, backgroundColor: "white", borderBottom: "1px solid #e0e0e0" }}>
      <Grid container spacing={0.2}>
      <Grid size={12}>
 <img
            src={Logo}
            alt="logo driver"
            style={{
              maxHeight: "50px",
            }}
          />
</Grid>

       

<Grid size={12} container alignItems="center" justifyContent="space-between" paddingInline={"3px"}>

  

         
          
<Grid item xs={6} container alignItems="left"  justifyContent="flex-start">
          <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
          <UserButton />
          </IconButton>
          </Tooltip>
          <IconButton color="inherit" style={{ marginRight: "5px" }}>
            <NotificationsIcon />
          </IconButton>
          </Grid>


          <Grid item xs={4} container justifyContent="flex-end">
          <Typography variant="body1" style={{ minWidth: "100" }}>
            {org_name}
          </Typography>
          </Grid>

          
          </Grid>

          </Grid>
          
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
  
        <Divider />
   
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

    </React.Fragment>
  );
};

export default TopBar;
