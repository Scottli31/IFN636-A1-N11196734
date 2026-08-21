import { useNavigate } from "react-router-dom";

function UnauthorizedPage() {
  const navigate = useNavigate();

  const handleReturn = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role === "Passenger") {
        navigate("/passenger/dashboard");
      } else if (user.role === "Staff") {
        navigate("/staff/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      navigate("/");
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1>Access Denied</h1>

      <p>
        You do not have permission to access this page.
      </p>

      <button onClick={handleReturn}>
        Return to Dashboard
      </button>
    </div>
  );
}

export default UnauthorizedPage;