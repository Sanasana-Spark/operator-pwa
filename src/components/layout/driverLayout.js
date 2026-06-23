import React from 'react';
import TopBar from './topbar';
import BottomBar from './bottomBar';
import { C } from '../../index'
import {
  Box
} from '@mui/material'

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      maxWidth: 430,
      mx: 'auto',
      background: C.bg,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <TopBar />
       
      {/* Page content */}
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        background: C.bg,
        '&::-webkit-scrollbar': { display: 'none' },
      }}>
        {children}
      </Box>

        <BottomBar />

    </Box>

  )
}

export default Layout
