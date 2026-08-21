import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import PassengerDashboard from "./pages/PassengerDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/passenger/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Passenger"]}>
              <PassengerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Staff"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;