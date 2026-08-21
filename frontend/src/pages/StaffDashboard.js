import LogoutButton from "../components/LogoutButton";

function StaffDashboard() {
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    user = null;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Staff Dashboard</h1>

      <p>
        Welcome to the Airport Staff Portal.
      </p>

      {user && (
        <p>
          Logged in as: {user.email}
        </p>
      )}

      <LogoutButton />
    </div>
  );
}

export default StaffDashboard;