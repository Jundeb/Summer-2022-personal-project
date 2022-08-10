import "./css/NotFound.css"
import { useEffect } from "react";

const NotFound = () => {

  //redirects to Login when on a wrong page
  useEffect(() => {
    setTimeout(() => {
      //change to http://localhost:3000/login when dev
      window.location.href = "https://webbank-junnukyro.herokuapp.com/login"
    }, 2500
    );
  }, []);

  return (
    <div className="notFound">
      <h1>Page not found</h1>
      <p>Redirecting to Login page.</p>
    </div>
  );
}

export default NotFound;