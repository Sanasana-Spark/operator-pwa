import React from 'react';
import TopBar from './topbar';
import BottomBar from './bottomBar';

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {

  return (
<div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar />
       
        <main style={{ flexGrow: 1, padding: '10px' }}>{children}</main>
        <BottomBar />

    </div>

  )
}

export default Layout
