import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import EventRegistration from "./pages/EventRegistration";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import {
  ProtectedRoute,
  AdminRoute,
  OrganizerRoute,
  GuestRoute,
} from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public/Guest Routes */}
        <Route
          path="/"
          element={<Home />}
        />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetails />} />

        {/* Guest Routes - Only for non-authenticated users */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />

        {/* Protected Routes - Requires authentication */}
        <Route
          path="/create-event"
          element={
            <OrganizerRoute>
              <CreateEvent />
            </OrganizerRoute>
          }
        />
        <Route
          path="/edit-event/:id"
          element={
            <OrganizerRoute>
              <EditEvent />
            </OrganizerRoute>
          }
        />
        <Route
          path="/register-event/:id"
          element={
            <ProtectedRoute>
              <EventRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer-dashboard"
          element={
            <OrganizerRoute>
              <OrganizerDashboard />
            </OrganizerRoute>
          }
        />

        {/* Admin Routes - Requires admin privileges */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes >
    </Router >
  );
};

export default App;
