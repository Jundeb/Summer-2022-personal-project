import "./css/Accounts.css"
import { useState, useEffect, useContext, useParams } from "react"
import { AgGridColumn, AgGridReact } from "ag-grid-react"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import axios from "./api/axios"
import UserContext from "./context/userProvider"


const Accounts = () => {
    const { user } = useContext(UserContext);

    const pathname = window.location.pathname;
    const findNum = pathname.split("/");
    const accountNumber = findNum[2];

    const [account, setAccount] = useState({ accountNumber: '', balance: '', limit: '' });
    const [transactions, setTransactions] = useState([]);

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
                console.log(response.data);
                setAccount({
                    accountId: response.data.accountId,
                    accountNumber: response.data.accountNumber,
                    balance: response.data.balance,
                    limit: response.data.limit,
                });

                setTransactions(response.data.transactions);

            } catch (err) {
                console.log(err.response);
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
                    <AgGridReact rowData={transactions} >
                        <AgGridColumn sortable={true} filter={true} field='date' headerName="Date" />
                        <AgGridColumn filter={true} field='transaction_name' headerName="Transaction Name" />
                        <AgGridColumn filter={true} field='amount' headerName="Amount" />
                        <AgGridColumn filter={true} field='from' headerName="From" />
                        <AgGridColumn filter={true} field='to' headerName="To" />
                    </AgGridReact>
                </div>
            </div>
        </section >
    );
}

export default Accounts;