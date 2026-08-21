import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // User is not authenticated
  if (!token || !storedUser) {
    return <Navigate to="/" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    // Remove invalid authentication information
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/" replace />;
  }

  // User is authenticated but does not have the required role
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;