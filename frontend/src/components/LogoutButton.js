import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication information
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect back to login page
    navigate("/", {
      replace: true,
    });
  };

  return (
    <button type="button" onClick={handleLogout}>
      Log out
    </button>
  );
}

export default LogoutButton;