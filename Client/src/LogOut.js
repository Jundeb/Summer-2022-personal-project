import "./css/LogOut.css"
import { Link } from "react-router-dom"

const LogOut = () => {
  return (
    <div className="logOut">
      <h1>You are logged out!</h1>
      <Link to="/login">Go To Login Page</Link>
    </div>
  );
}

export default LogOut;