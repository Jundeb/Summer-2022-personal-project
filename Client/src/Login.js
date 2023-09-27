import "./css/Login.css"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { ClipLoader } from 'react-spinners';

import axios from "./api/axios"
import UserContext from "./context/userProvider"

const LOGIN_URL = "/auth";

const Login = () => {
    const { setUser } = useContext(UserContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        //prevents reloading of the page
        e.preventDefault();

        setLoading(true);

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });

            const accessToken = response?.data?.accessToken;
            const userId = response?.data?.usersID;

            setUser({ userId, username, accessToken });

            setSuccess(true);
            setLoading(false);

            setUsername('');
            setPassword('');
            
        } catch (error) {
            if (!error?.response) {
                setErrorMessage('No Server Response');
            }
            else if (error.response?.status === 400) {
                setErrorMessage('Missing Username or Password');
            }
            else if (error.response?.status === 401) {
                setErrorMessage('Unauthorized');
            }
            else {
                setErrorMessage('Login Failed');
            }
        }
    }

    useEffect(() => {
        setErrorMessage('');
    }, [username, password]);

    return (
        <>
            {success
                ? (<section className="successLogin">
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <Link to="/main">Go To Home</Link>
                    </p>
                </section>)
                :
                (<section className="loginSection">
                    <h1>Sign In</h1>
                    <span className="error">
                        {errorMessage}
                    </span>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username</label>
                        <br />
                        <input
                            className="loginInput"
                            type='text'
                            id='username'
                            autoComplete='off'
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                        />
                        <br />
                        <label htmlFor="password">Password</label>
                        <br />
                        <input
                            className="loginInput"
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                        <br />
                        {loading 
                        ? <button className="loginButton" disabled><ClipLoader loading color="white" size={20}/></button>
                        : <button className="loginButton">Sign In</button>
                        }
                    </form>
                    <div className="line">
                    </div>
                    <div className="needAnAccount">
                        <p>Need an account?</p>
                        <Link to="/register">Sign Up</Link>
                    </div>
                </section>
                )
            }
        </>
    )

}

export default Login;