import React from 'react';
import VerticalSidebar from './sidebar';
import TopBar from './topbar';

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  const topBarHeight = '45px';

  return (


<div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ height: topBarHeight, width: '100vw', zIndex: 10 }}>
        <TopBar />
      </div>

      <div style={{ display: 'flex', flexGrow: 1, marginTop: topBarHeight }}>
        <VerticalSidebar topBarHeight={topBarHeight}  />

        <main style={{ flexGrow: 1 }}>
          {children}
        </main>
      </div>

      </div>


  )
}

export default Layout
