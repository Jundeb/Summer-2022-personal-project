import "./Register.css";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faInfoCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
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
    if(!valid1 || !valid2)
    {
      setErrorMessage("Invalid Entry");
      return;
    }

    try {
      const response = await axios.post(REGISTER_URL,
        JSON.stringify({username: user, password}),
        {
          headers: {'Content-type': 'application/json'},
          withCredentials: true
        }
        );

        console.log(response.data);
        console.log(response.accessToken);
        console.log(JSON.stringify(response));
        setSuccess(true);
        
    } catch (err) {
      if(!err?.response){
        setErrorMessage('No Server Response');
      } else if(err.response?.status === 409) {
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
          <section>
            <h1>Success!</h1>
            <p>
              <a href="#">Sign In</a>
            </p>
          </section>
        )
        : (
          <section>
            <h1>Register</h1>
            <p className="errorMessage">
              {errorMessage}
            </p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">
                Username:
                <span className="valid">
                  {validName && <FontAwesomeIcon icon={faCheck} />}
                </span>
                <span className="invalid">
                  {validName || !user
                    ? null
                    : <FontAwesomeIcon icon={faXmark} />
                  }
                </span>
              </label>
              <br />
              <input
                type="text"
                id="username"
                autoComplete="off"
                onChange={(event) => setUser(event.target.value)}
                required
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
              />
              <p id="uidnote" className="instructions">
                {(userFocus && !validName)
                  ? <span> <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 23 characters.<br />
                    Must begin with a letter <br />
                    Letters, numbers, underscores, hyphens allowed.
                  </span>
                  : null
                }
              </p>
              <label htmlFor="password">
                Password:
                <span className="valid">
                  {validPassword && <FontAwesomeIcon icon={faCheck} />}
                </span>
                <span className="invalid">
                  {validPassword || !password
                    ? null
                    : <FontAwesomeIcon icon={faXmark} />
                  }
                  <br />
                </span>
              </label>
              <input
                type="password"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              <p id="passwordNote" className="instructions">
                {passwordFocus && !validPassword
                  ? <span> <FontAwesomeIcon icon={faInfoCircle} />
                    5 to 24 characters. <br />
                    Must include uppercase and lowercase letters, a number and a special character. <br />
                    Allowed special characters: !@?$ </span>
                  : null
                }
              </p>
              <label htmlFor="confirmPassword">
                Confirm password:
                <span className="valid">
                  {validMatch && matchPassword
                    ? <FontAwesomeIcon icon={faCheck} />
                    : null
                  }
                </span>
                <span className="invalid">
                  {validMatch || !matchPassword
                    ? null
                    : <FontAwesomeIcon icon={faXmark} />
                  }
                </span>
              </label>
              <br />
              <input
                type="password"
                id="confirmPassword"
                onChange={(event) => setMatchPassword(event.target.value)}
                required
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              <p id="confirmPasswordNote" className="instructions">
                {matchFocus && !validMatch
                  ? <span> <FontAwesomeIcon icon={faInfoCircle} />
                    Must be same as password. <br />
                  </span>
                  : null
                }
              </p>
              <button type="submit" disabled={!validName || !validPassword || !validMatch ? true : false}>
                Sign Up
              </button>
            </form>
            <p className="alreadyRegistered">
              Already registered
              <br/>
              <a href="#">Sign In</a>
            </p>
          </section>
        )
      }
      </>
    )
  }

      export default Register;