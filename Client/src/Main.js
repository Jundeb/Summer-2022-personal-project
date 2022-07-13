import "./css/Main.css"
import Transfer from "./Transfer";
import { useState, useEffect, useContext } from "react";
import { Link} from "react-router-dom"
import axios from "./api/axios";
import UserContext from "./context/userProvider";
import useRefreshToken from "./hooks/useRefreshToken";

const Main = () => {
    const { user, setUser } = useContext(UserContext);
    const refresh = useRefreshToken();

    const [update, setUpdate] = useState(false);
    const [userInfo, setUserInfo] = useState({ firstname: '', lastname: '', address: '', phonenumber: '' });
    const [debitAccount, setDebitAccount] = useState({ accountId: '', accountNumber: '', balance: '', limit: '' });
    const [creditAccount, setCreditAccount] = useState({ accountId: '', accountNumber: '', balance: '', limit: '' });

    const [creditSuccess, setCreditSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`/user/${user.userId}`,
                    {
                        headers: { 'Authorization': 'Bearer ' + user.accessToken },
                        withCredentials: true
                    }
                );
                console.log(response.data);

                setUserInfo({
                    firstname: response.data.personalInfo.firstname,
                    lastname: response.data.personalInfo.lastname,
                    address: response.data.personalInfo.address,
                    phonenumber: response.data.personalInfo.phonenumber
                });

                setDebitAccount({
                    accountId: response.data.account1.accountId,
                    accountNumber: response.data.account1.accountNumber,
                    balance: response.data.account1.balance,
                    limit: response.data.account1.limit
                });

                if (response.data?.account2) {
                    setCreditAccount({
                        accountId: response.data.account2.accountId,
                        accountNumber: response.data.account2.accountNumber,
                        balance: response.data.account2.balance,
                        limit: response.data.account2.limit
                    });
                }
                setUpdate(false);

            } catch (err) {
                console.error(err.data);
            }
        }
        getUser();
    }, [update]);

    

    const handleCreditCreate = async () => {
        try {
            const response = await axios.post('/account',
                JSON.stringify({ username: user.username }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + user.accessToken
                    },
                    withCredentials: true
                });

            console.log(response.data);
            setCreditSuccess(true);
            setErrorMessage('');

        } catch (error) {
            console.log(error.response.data);
            if (!error?.response) {
                setErrorMessage('No Server Response');
            }
            else if (error.response?.status === 204) {
                setErrorMessage('Server Error');
            }
            else if (error.response?.status === 403) {
                setErrorMessage('Credit account already exists.');
            }
            else {
                setErrorMessage('Action Failed');
            }
        }
    }

    return (
        <>
            {user.userId &&
                <section>
                    <div className="infoDiv">
                        <h4>Personal Info: </h4>
                        {userInfo.firstname !== ''
                            ? <span>{userInfo.firstname + " " + userInfo.lastname}</span>
                            : " -"
                        }
                        <br />
                        {userInfo.address !== ''
                            ? <span>{userInfo.address}</span>
                            : " -"
                        }
                        <br />
                        {userInfo.phonenumber !== ''
                            ? <span>{userInfo.phonenumber}</span>
                            : " -"
                        }
                        <div className="infoUpdate">
                            <h5>Want to update info?</h5>
                            <Link to="/updateInfo">
                                <button className="updateInfoButton">
                                    Update Info
                                </button>
                            </Link>
                        </div>
                    </div>
                    <Transfer setUpdate={setUpdate} debit={debitAccount.accountNumber} credit={creditAccount.accountNumber} debitBalance={debitAccount.balance} creditBalance={creditAccount.balance} />
                    <div className="accountsDiv">
                        <h3>Accounts:</h3>
                        <Link to="/accounts/0">
                            <button className="accountsButton">
                                {"Debit " + debitAccount.balance + "€"}
                            </button>
                        </Link>
                        <br />
                        {creditAccount.accountNumber !== ''
                            ? <Link to="/accounts/1">
                                <button className="accountsButton">
                                    {"Credit " + creditAccount.balance + "€"}
                                </button>
                            </Link>
                            : null
                        }
                    </div>
                    {creditAccount.accountNumber === ''
                        ?
                        <div className="creditDiv">
                            {creditSuccess
                                ?
                                <div className="successCredit">
                                    <h3> Success! </h3>
                                    <h4>New credit account created. </h4>
                                    <p>Your Credit limit is automatically
                                        set to 2000. When you login next time
                                        your credit account should appear under Accounts:</p>
                                </div>
                                : <div>
                                    <h4> Don't have an credit account?</h4>
                                    <span className="error">
                                        {errorMessage}
                                    </span>
                                    <button onClick={handleCreditCreate} className="createCreditButton">
                                        Create Credit Account
                                    </button>
                                </div>
                            }
                        </div>
                        : null
                    }
                </section>
            }
        </>
    )
}

export default Main;