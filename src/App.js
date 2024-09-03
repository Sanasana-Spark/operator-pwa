import React from 'react';
import { SignIn, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/onboarding/authProvider';
import ProtectedRoute from './components/onboarding/protectedRoute';
import DriverLayout from "./components/layout/driverLayout";
import Logout from './pages/logout';
import DriverView from './components/driver-view/DriverView';
import DriverHome from './pages/driverHome';
import TripHistory from './pages/tripHistory';
import UpcomingTrips from './pages/upcomingTrips';
import RequestFuel from './components/request-fuel/requestFuel'; // 
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/login" element={<SignedOut><SignInButton /></SignedOut>} />
            <Route path="*" element={<Navigate to="/signin" />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><DriverLayout><UpcomingTrips /></DriverLayout></ProtectedRoute>} />
            <Route path="/driver1" element={<SignedIn><DriverLayout><DriverView /></DriverLayout></SignedIn>} />
            <Route path="/drive" element={<SignedIn><DriverLayout><DriverHome /></DriverLayout></SignedIn>} />
            <Route path="/history" element={<SignedIn><DriverLayout><TripHistory /></DriverLayout></SignedIn>} />
            <Route path="/newtrips" element={<SignedIn><DriverLayout><UpcomingTrips /></DriverLayout></SignedIn>} />
            <Route path="/logout" element={<SignedIn><DriverLayout><Logout /></DriverLayout></SignedIn>} />

            {/* New Route for RequestFuel */}
            <Route path="/request-fuel" element={<SignedIn><DriverLayout><RequestFuel /></DriverLayout></SignedIn>} />
          </Routes>
        </AuthProvider>
      </div>
    </Router>
  );
};

export default App;
