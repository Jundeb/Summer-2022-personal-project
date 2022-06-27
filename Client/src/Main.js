import "./css/Main.css"
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom"
import axios from "./api/axios";
import UserContext from "./context/userProvider";
import useRefreshToken from "./hooks/useRefreshToken";

const Main = () => {
    const { user } = useContext(UserContext);
    const refresh = useRefreshToken();

    const [userInfo, setUserInfo] = useState({ firstname: '', lastname: '', address: '', phonenumber: '' });
    const [debitAccount, setDebitAccount] = useState({ accountId: '', accountNumber: '', balance: '', limit: '' });
    const [creditAccount, setCreditAccount] = useState({ accountId: '', accountNumber: '', balance: '', limit: '' });

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

            } catch (err) {
                console.error(err.data);
            }
        }
        getUser();
    }, []);

    return (
        <>
            {!user.userId
            ? null
            :
                <section>
                    <section className="infoSection">
                        <h4>Personal Info: </h4>
                        <span>
                            Name:
                            {userInfo.firstname !== ''
                                ? <span>{" " + userInfo.firstname + " " + userInfo.lastname}</span>
                                : " -"
                            }
                        </span>
                        <br />
                        <span>
                            Address:
                            {userInfo.address !== ''
                                ? <span>{" " + userInfo.address}</span>
                                : " -"
                            }
                        </span>
                        <br />
                        <span>
                            Phonenumber:
                            {userInfo.phonenumber !== ''
                                ? <span>{" " + userInfo.phonenumber}</span>
                                : " -"
                            }
                        </span>
                        <span>
                            <h5>Want to update info?</h5>
                            <Link to="/updateInfo">
                                <button className="updateInfoButton">
                                    Update Info
                                </button>
                            </Link>
                        </span>
                    </section>
                    <section className="accountsSection">
                        <h1>Accounts:</h1>
                        <Link to="#">
                            <button className="accountsButton">
                                {"Debit " + debitAccount.balance}
                            </button>
                        </Link>
                        <br />
                        {creditAccount.accountNumber === ''
                           ? <Link to="#">
                            <button className="accountsButton">
                                {"Credit " + creditAccount.balance}
                            </button>
                            </Link> 
                            : null
                        }
                        
                    </section>
                    {creditAccount.accountNumber === ''
                        ? <section className="creditSection">
                            <h4> Don't have credit account?</h4>
                            <br />
                            <Link to="/createCredit">
                                <button className="createCreditButton">
                                    Create Credit Account
                                </button>
                            </Link>
                        </section>
                        : null
                    }
                </section>
            }
        </>
    )
}

export default Main;