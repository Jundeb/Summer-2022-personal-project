import "./css/Accounts.css"
import { useState, useEffect, useContext } from "react"

import { AgGridReact } from "ag-grid-react"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import axios from "./api/axios"
import UserContext from "./context/userProvider"


const Accounts = () => {
    const { user } = useContext(UserContext);

    //in Main when user selects which account to view, pathname ends either to 0 or 1
    //and then the number is saved in a accountNumber variable
    const pathname = window.location.pathname;
    const findNum = pathname.split("/");
    const accountNumber = findNum[2];

    const [account, setAccount] = useState({ accountNumber: '', balance: '', limit: '' });

    const [transactions, setTransactions] = useState([]);

    const columnDefs = [
        { field: 'date', sort: 'desc', sortable: true },
        { field: 'transaction_name', headerName: 'Transaction Name' },
        { field: 'amount' },
        { field: 'from' },
        { field: 'to' },
    ];

    //gets user account information and all transactions
    useEffect(() => {
        const getAccount = async () => {

            const userId = user.userId;

            try {
                const response = await axios.post('/account/transactions',
                    JSON.stringify({ userId, accountNumber }),
                    {
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': 'Bearer ' + user.accessToken
                        },
                        withCredentials: true
                    }
                );

                setAccount({
                    accountId: response.data.accountId,
                    accountNumber: response.data.accountNumber,
                    balance: response.data.balance,
                    limit: response.data.limit,
                });

                setTransactions(response.data.transactions);

            } catch (error) {
                if (error.response.status === 403 || error.response.status === 401) {
                    //change to http://localhost:3000/login when in dev
                    window.location.href = "https://webbank-junnukyro.herokuapp.com/main"
                }
            }
        }
        getAccount();
    }, []);

    return (
        <section>
            <div className="mainBox">
                <div className="topBar">
                    <div className="account">
                        <p className="accountBox" id="accountBalance">Balance: {account.balance}€</p>
                        <p className="accountBox">{account.accountNumber}</p>
                        {account.limit !== 0
                            ? <p className="accountBox">Limit: {account.limit}€ </p>
                            : null
                        }
                    </div>
                </div>
                <div className="ag-theme-material" style={{ height: 585, width: 1020, margin: 'auto' }}>
                    <AgGridReact rowData={transactions} columnDefs={columnDefs} >
                    </AgGridReact>
                </div>
            </div>
        </section >
    );
}

export default Accounts;