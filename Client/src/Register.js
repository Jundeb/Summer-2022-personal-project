import "./css/Register.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faInfoCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"
import axios from "./api/axios";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{4,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@?$]).{5,24}$/;
const REGISTER_URL = '/register';

const Register = () => {

  const [user, setUser] = useState('');
  const [validName, setValidname] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState(null);
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //everytime user input is changed checks if it's valid
  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidname(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword;
    password.length > 0 ? setValidMatch(match) : setValidMatch(false)
    console.log(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrorMessage('');
  }, [user, password, matchPassword]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    //if button enabled with JS hack
    const valid1 = USER_REGEX.test(user);
    const valid2 = PWD_REGEX.test(password);
    if (!valid1 || !valid2) {
      setErrorMessage("Invalid Entry");
      return;
    }

    try {
      const response = await axios.post(REGISTER_URL,
        JSON.stringify({ username: user, password }),
        {
          headers: { 'Content-type': 'application/json' },
          withCredentials: true
        }
      );

      console.log(response.data);
      console.log(response.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);

    } catch (err) {
      if (!err?.response) {
        setErrorMessage('No Server Response');
      } else if (err.response?.status === 409) {
        setErrorMessage('Username Taken');
      }
      else {
        setErrorMessage('Registration Failed');
      }
    }
  }

  return (
    <>
      {success
        ? (
          <section className="successRegister">
            <h1>Success!</h1>
            <p>
              <Link to="/login">Sign In</Link>
            </p>
          </section> )
        : 
          (<section className="registerSection">
            <h1>Register</h1>
            <span className="error">
              {errorMessage}
            </span>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">
                Username
                {validName &&
                  <span className="valid">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                }
                {(!validName && user) &&
                  <span className="invalid">
                    <FontAwesomeIcon icon={faXmark} />
                  </span>
                }
              </label>
              <br />
              <input
                className="registerInput"
                type="text"
                id="username"
                autoComplete="off"
                onChange={(event) => setUser(event.target.value)}
                required
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              {(userFocus && !validName) &&
                <p id="uidnote" className="instructions">
                  <span className="infoCircle"><FontAwesomeIcon icon={faInfoCircle} /></span>
                  4 to 23 characters.<br />
                  Must begin with a letter <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              }
              <br />
              <label htmlFor="password">
                Password
                {validPassword &&
                  <span className="valid">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                }
                {(!validPassword && password) &&
                  <span className="invalid">
                    <FontAwesomeIcon icon={faXmark} />
                  </span>
                }
              </label>
              <br />
              <input
                className="registerInput"
                type="password"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              {(passwordFocus && !validPassword) &&
                <p id="passwordNote" className="instructions">
                 <span className="infoCircle"><FontAwesomeIcon icon={faInfoCircle} /></span>
                  5 to 24 characters. <br />
                  Must include uppercase and lowercase letters, a number and a special character. <br />
                  Allowed special characters: !@?$
                </p>
              }
              <br />
              <label htmlFor="confirmPassword">
                Confirm password
                {(validMatch && matchPassword) &&
                  <span className="valid">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                }
                {(!validMatch && matchPassword) &&
                  <span className="invalid">
                    <FontAwesomeIcon icon={faXmark} />
                  </span>
                }
              </label>
              <br />
              <input
                className="registerInput"
                type="password"
                id="confirmPassword"
                onChange={(event) => setMatchPassword(event.target.value)}
                required
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              {(matchFocus && !validMatch) &&
                <p id="confirmPasswordNote" className="instructions">
                  <span className="infoCircle"><FontAwesomeIcon icon={faInfoCircle} /></span>
                  Must be same as password.
                </p>
              }
              <button className ="registerButton" disabled={!validName || !validPassword || !validMatch ? true : false}>
                Sign Up
              </button>
            </form>
            <p className="alreadyRegistered">
              Already registered?
              <br />
              <Link to="/login">Sign In</Link>
            </p>
          </section>
        )
      }
    </>
  )
}

export default Register;