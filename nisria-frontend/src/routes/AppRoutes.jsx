import { ROLES } from "../constants/roles";
import Dashboard from "../pages/dashboards/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Landing from "../pages/Landing";
// import Unauthorized from "../pages/Unauthorized"; // create this if you want

import { Routes, Route, Navigate } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

      <Route
        path="/dashboard/compass"
        element={<Navigate to="/dashboard/compass/dashboard" replace />}
      />

      <Route
        path="/dashboard/compass/*"
        element={
          <ProtectedRoute allowedRoles={[
            ROLES.SUPER_ADMIN,
            ROLES.ADMIN,
            ROLES.MANAGEMENT_LEAD,
            ROLES.GRANT_OFFICER
          ]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Add other routes here */}
    </Routes>
  );
}

export default AppRoutes;