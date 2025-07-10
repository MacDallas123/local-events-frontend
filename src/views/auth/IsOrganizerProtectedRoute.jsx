import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const IsOrganizerProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if(token && (user.role == "organizer" || user.role == "admin" || user.role == "super_admin"))
    return children;
  else {
    return <Navigate to="/403" replace />
  }
};

IsOrganizerProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IsOrganizerProtectedRoute;
