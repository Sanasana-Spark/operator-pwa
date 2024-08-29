// components/ProtectedRoute.js
import React from 'react';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {

  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <SignIn />
      </Box>
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;
