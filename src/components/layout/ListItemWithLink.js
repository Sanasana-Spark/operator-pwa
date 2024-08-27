/* eslint-disable react/prop-types */
import React from 'react'
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { styled } from '@mui/material/styles';
import { NavLink } from 'react-router-dom' // Import Link for navigation

// Define custom styled components
const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.5),
  margin: theme.spacing(0.5, 0),
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(0.25),
  minHeight: '25px', // Adjust the height as needed
}));


const ListItemWithLink = ({ label, icon, to }) => {
  return (
    <StyledListItem className='dashboardLink'>
      <StyledListItemButton component={NavLink} to={to}>
        <ListItemIcon className='dashIcon'>{icon}</ListItemIcon>
        <ListItemText className='dashLabel' primary={label} />
      </StyledListItemButton>
    </StyledListItem>
  )
}

export default ListItemWithLink
