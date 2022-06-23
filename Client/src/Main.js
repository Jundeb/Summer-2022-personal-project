import "./Main.css"
import { useState, useEffect, useContext  } from "react";
import axios from "./api/axios";
import UserContext from "./context/userProvider";
import useRefreshToken from "./hooks/useRefreshToken";

const Main = () => {
    const { user } = useContext(UserContext);
    const refresh = useRefreshToken();

    const [userInfo, setUserInfo] = useState({firstname: '', lastname:'', address: '', phonenumber: ''});
    const [debitAccount, setDebitAccount] = useState({accountId: '', accountNumber: '', balance: '', limit: ''});
    const [creditAccount, setCreditAccount] = useState({accountId: '', accountNumber: '', balance: '', limit: ''});

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`/user/${user.userId}`,
                {
                    headers: {'Authorization' : 'Bearer ' + user.accessToken},
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
                setCreditAccount({
                    accountId: response.data.account2.accountId,
                    accountNumber: response.data.account2.accountNumber,
                    balance: response.data.account2.balance,
                    limit: response.data.account2.limit
                });
            } catch (err) {
                console.error(err.data);
            }
        }
        getUser(); 
    }, []); 
    
    return(
        <section>
            <section className="infoSection">
                <span>
                Name: 
                    { userInfo.firstname !== ''
                     ? <span>{" " + userInfo.firstname + " " + userInfo.lastname}</span>
                     : " -"
                    }
                </span>
                <br/>
                <span>
                Address: 
                    { userInfo.address !== ''
                     ? <span>{" " + userInfo.address}</span>
                     : " -"
                    }
                </span>
                <br/>
                <span>
                Phonenumber: 
                    { userInfo.phonenumber !== ''
                     ? <span>{" " + userInfo.phonenumber}</span>
                     : " -"
                    }
                </span>
            </section>
            <section className="accountsSection">
              <h1>Accounts:</h1>
              <span>
                  {debitAccount.accountNumber +" "+ debitAccount.balance}
              </span>
              <br/>
              <span>
                  {creditAccount.accountNumber + " " + creditAccount.balance}
              </span>
              <br/>
              <button onClick={() => refresh()}>Refresh</button>
            </section>
        </section>
    )
}

export default Main;