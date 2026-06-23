import React, { useState, useEffect } from "react";
import {
  IconButton,
  Badge,
  Menu,
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
  Box,
  ListItemButton,
} from "@mui/material";
import { C } from '../../index'
import NotificationsIcon from "@mui/icons-material/Notifications";
import Logo from "../../assets/logo.png";
import { useAuthContext } from "../onboarding/authProvider";

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
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        flexShrink: 0,
        background: C.surface,
      }}
    >

      <Box sx={{ fontSize: '0.9375rem', fontWeight: 700, color: 'white', letterSpacing: '-0.2px' }}>
         <img
          src={Logo}
          alt="logo driver"
          style={{
            maxHeight: "50px",
          }}
        />
        </Box>


      <Box sx={{ display: "flex", justifyContent: "right", width: "100%" }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: "semi-bold", color: "black" }}
        >
          {org_name}
        </Typography>
      </Box>




  <IconButton
          onClick={(e) => setNotifAnchorEl(e.currentTarget)}
          className="top-icon-btn"
          sx={{ border: 'none', borderRadius: '7px', width: 32, height: 32 }}
        >
          <Badge badgeContent={notifications.length} color="error" slotProps={{ badge: { className: 'notif-pip' } }}>
            <NotificationsIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
          </Badge>
        </IconButton>
        
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
