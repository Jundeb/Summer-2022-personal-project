import "./css/UpdateInfo.css";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "./api/axios";
import UserContext from "./context/userProvider";

const UPDATEINFO_URL = '/info';

const UpdateInfo = () => {

    const { user } = useContext(UserContext);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [address, setAddress] = useState('');
    const [phonenumber, setPhonenumber] = useState('');

    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setErrorMessage('');
    }, [firstname, lastname, address, phonenumber]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(user.userId, firstname, lastname, address, phonenumber);
        try {
            const response = await axios.post(UPDATEINFO_URL,
                JSON.stringify({ id: user.userId, firstname, lastname, address, phonenumber }),
                {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + user.accessToken
                    },
                    withCredentials: true
                }
            );

            console.log(response.data);
            setSuccess(true);

        } catch (error) {
            if (!error?.response) {
                setErrorMessage('No Server Response');
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
                    <h4>Personal info updated!</h4>
                    <Link to="/main">Go To Home</Link>
                </section>
                : <section className="updatePersonalInfo">
                    <div className="returnIconDiv">
                        <Link to="/main">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                    </div>
                    <h1>Update Personal Info</h1>
                    <span className="error">
                        {errorMessage}
                    </span>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="firstname">
                            Firstname
                        </label>
                        <br />
                        <input
                            className="updateInfoInput"
                            type="text"
                            autoComplete="off"
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                        <br />
                        <label htmlFor="lastname">
                            Lastname
                        </label>
                        <br />
                        <input
                            className="updateInfoInput"
                            type="text"
                            autoComplete="off"
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                        <br />
                        <label htmlFor="address">
                            Address
                        </label>
                        <br />
                        <input
                            className="updateInfoInput"
                            type="text"
                            autoComplete="off"
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                        <br />
                        <label htmlFor="phonenumber">
                            Phonenumber
                        </label>
                        <br />
                        <input
                            className="updateInfoInput"
                            type="text"
                            autoComplete="off"
                            onChange={(e) => setPhonenumber(e.target.value)}
                            required
                        />
                        <br />
                        <button className="updateInfoButton" type="submit">
                            Update Info
                        </button>
                    </form>
                </section>
            }
        </>
    );
}

export default UpdateInfo;