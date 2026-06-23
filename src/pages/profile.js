/* eslint-disable no-undef */
import React from 'react';
import {Box, Typography, IconButton,} from '@mui/material'
import EditIcon   from '@mui/icons-material/Edit'
import { C } from '../index'
import { UserButton } from "@clerk/clerk-react";

const Profile = () => {



  return (
     <Box sx={{ pb: 2 }}>
    {/* Header */}
      <Box sx={{
        px: 2.5, pt: 2, pb: 1.5,
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center',
      }}>
        <Typography variant="h3" sx={{ flex: 1 }}>My Profile</Typography>
        <IconButton size="small">
          <EditIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>


    <Box sx={{ textAlign: 'center', pt: 3, pb: 2.5 }}>
        <UserButton afterSignOutUrl="/signin" />
    </Box>

    </Box>
   
  )
}

export default Profile