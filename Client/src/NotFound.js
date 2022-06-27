import "./css/NotFound.css"
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="notFound">
      <h1>Page not found</h1>
      <Link to="/login">Go To Login Page</Link>
    </div>
  );
}

export default NotFound;