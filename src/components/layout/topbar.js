import React, { useState, useEffect } from "react";
import { UserButton } from "@clerk/clerk-react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemIcon,
  Tooltip,
  Box,
  Divider,
  ListItemButton,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import Settings from "@mui/icons-material/Settings";
import Logo from "../../assets/logo.png";
import { useAuthContext } from "../onboarding/authProvider";
import Logout from "@mui/icons-material/Logout";
import Grid from "@mui/material/Grid2";

const TopBar = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { org_name, user_id, apiFetch} = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState(2);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // State for notifications
const [notifAnchorEl, setNotifAnchorEl] = useState(null);
const notifOpen = Boolean(notifAnchorEl);

// State for account menu
const [accountAnchorEl, setAccountAnchorEl] = useState(null);
const accountOpen = Boolean(accountAnchorEl);


  const handleClose = () => {
    setAccountAnchorEl(null);
  };

  // Fetch notifications based on tab (all, read, unread)
  const fetchNotifications = async (status = "unread") => {
    try {
      const apiUrl = `${baseURL}/notifications/?status=${status}`;
      const response = await apiFetch(apiUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    // initial fetch with all
    fetchNotifications("unread");
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
   []);

  // Tab switch fetches notifications from backend
  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    if (newValue === 0) fetchNotifications("all");
    if (newValue === 1) fetchNotifications("read");
    if (newValue === 2) fetchNotifications("unread");
  };

  // Update status
  const updateStatus = async (notification_id, status) => {
    try {
      const apiUrl = `${baseURL}/notifications/${user_id}/update-status/`;
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification_id: notification_id, status: status }),
      });
      // refresh current tab data
      if (tab === 0) fetchNotifications("all");
      if (tab === 1) fetchNotifications("read");
      if (tab === 2) fetchNotifications("unread");
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  // Open notification dialog
  const handleOpenNotification = (notification) => {
    console.log("Opening notification:", notification);
    setSelectedNotification(notification);
    setDialogOpen(true);
    if (notification.read === false || notification.read === "false") {
      updateStatus(notification.id, "read");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        zIndex: 1000,
        width: "100%",
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100vw",
          justifyContent: "space-between",
        }}
      >
        <img
          src={Logo}
          alt="logo driver"
          style={{
            maxHeight: "50px",
          }}
        />

        <Grid>
          <Tooltip title="Notifications">
            <IconButton
              onClick={(e) => setNotifAnchorEl(e.currentTarget)}
              color="inherit"
              aria-label="notifications"
            >
              <Badge
                badgeContent={
                  notifications.length
                }
                color="error"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Account settings">
            <IconButton
              onClick={(e) => setAccountAnchorEl(e.currentTarget)}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={accountOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={accountOpen ? "true" : undefined}
            >
              <UserButton />
            </IconButton>
          </Tooltip>
        </Grid>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "right", width: "100%" }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "semi-bold", color: "black" }}
        >
          {org_name}
        </Typography>
      </Box>

      <Menu
        anchorEl={accountAnchorEl}
        id="account-menu"
        open={accountOpen}
        onClose={() => setAccountAnchorEl(null)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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

      <Menu
        anchorEl={notifAnchorEl}
        open={notifOpen}
        onClose={() => setNotifAnchorEl(null)}
        PaperProps={{ style: { width: 360 } }}
      >
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="All" />
          <Tab label="Read" />
          <Tab label="Unread" />
        </Tabs>
        <List>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          ) : (
            notifications.map((n) => (
              <ListItem
                key={n.id} disablePadding
              >
                  <ListItemButton onClick={() => handleOpenNotification(n)}>
                <ListItemText
                  primary={n.category || "Notification"}
                  secondary={n.message}
                  primaryTypographyProps={{
                    fontWeight: n.read === "false" ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>

            ))
          )}
        </List>
      </Menu>

      {/* Notification detail dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>
          {selectedNotification?.category || "Notification"}
        </DialogTitle>
        <DialogContent>
          <p>{selectedNotification?.message}</p>
          {selectedNotification && (selectedNotification.read === true || selectedNotification.read === "true") && (
            <Button
              variant="outlined"
              onClick={() => updateStatus(selectedNotification.id, "unread")}
            >
              Mark as Unread
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TopBar;
