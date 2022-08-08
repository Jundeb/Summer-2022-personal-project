import "./css/ChangePassword.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./api/axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faInfoCircle, faXmark } from "@fortawesome/free-solid-svg-icons";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@?$]).{5,24}$/;

const ChangePassword = () => {

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [newPasswordFocus, setNewPasswordFocus] = useState(false);

    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setErrorMessage('');
    }, [username, password, newPassword]);

    useEffect(() => {
        const result = PWD_REGEX.test(newPassword);
        setValidPassword(result);
    }, [newPassword]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const valid1 = PWD_REGEX.test(newPassword);

        if (!valid1) {
            setErrorMessage('New Password Not Valid');
            return;
        }

        try {
            const response = await axios.post('/auth/changepassword',
                JSON.stringify({ username, password, newPassword }),
                {
                    headers: { 'Content-type': 'application/json' },
                    withCredentials: true
                }
            );

            console.log(response.status);
            
            setSuccess(true);

        } catch (error) {
            if (!error?.response) {
                setErrorMessage('No Server Response');
            }
            else if (error.response?.status === 401) {
                setErrorMessage('Username Or Password Incorrect');
            }
            else if(error.response?.status === 404)
            {
                setErrorMessage("User doesn't exist.");
            }
            else {
                setErrorMessage('Update Failed');
            }
        }
    }

    return (
        <>
            {success
                ? <section className="successUpdateinfo">
                    <h1>Success!</h1> <br />
                    <h4>Password Changed!</h4>
                    <Link to="/login">Go To Login</Link>
                </section>
                : <section className="changePassword">
                    <h1>Change Password</h1>
                    <span className="error">
                        {errorMessage}
                    </span>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username
                        </label>
                        <br />
                        <input
                            className="changePasswordInput"
                            type="text"
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <br />
                        <label htmlFor="password">
                            Password
                        </label>
                        <br />
                        <input
                            className="changePasswordInput"
                            type="password"
                            autoComplete="off"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <br />
                        <label htmlFor="newPassword">
                            New Password
                            {validPassword &&
                                <span className="valid">
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                            }
                            {(!validPassword && newPassword) &&
                                <span className="invalid">
                                    <FontAwesomeIcon icon={faXmark} />
                                </span>
                            }
                        </label>
                        <br />
                        <input
                            className="changePasswordInput"
                            type="password"
                            autoComplete="off"
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            onFocus={() => setNewPasswordFocus(true)}
                            onBlur={() => setNewPasswordFocus(false)}
                        />
                        {(newPasswordFocus && !validPassword) &&
                            <p className="instructions">
                                <span className="infoCircle"><FontAwesomeIcon icon={faInfoCircle} /></span>
                                5 to 24 characters. <br />
                                Must include uppercase and lowercase letters, a number and a special character. <br />
                                Allowed special characters: !@?$
                            </p>
                        }
                        <br />
                        <button className="changePasswordButton" type="submit">
                            Change Password
                        </button>
                    </form>
                    <div className="line"></div>
                    <div className="changePasswordSignIn">
                        <Link to="/login">Sign In</Link>
                    </div>
                </section>
            }
        </>
    );
}

export default ChangePassword;