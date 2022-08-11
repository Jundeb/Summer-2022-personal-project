import "./css/Transfer.css"
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, TextField, Select, MenuItem, Box, OutlinedInput, InputAdornment } from "@mui/material";
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext, useEffect } from "react";
import UserContext from "./context/userProvider";
import axios from "./api/axios";

const Transfer = ({ setUpdate, debit, credit, debitBalance, creditBalance }) => {
    const { user } = useContext(UserContext);

    const [open, setOpen] = useState(false);

    //loading is for visual loading circle
    const [loading, setLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('');

    const [account1, setAccount1] = useState('');
    const [account2, setAccount2] = useState('');
    const [amount, setAmount] = useState('');

    //setting states empty and false when closing transaction dialog
    const handleClose = () => {
        setOpen(false);
        setLoading(false);
        setErrorMessage('');
        setAccount1('');
        setAccount2('');
        setAmount('');
    }

    //opens transaction dialog when pressing the transfer icon
    const handleOpen = () => {
        setOpen(true);
    }

    //setting error and success messages empty when changing any input in transaction dialog
    useEffect(() => {
        setErrorMessage('');
        setSuccessMessage('');
    }, [account1, account2, amount]);

    const handleTransaction = async () => {

        //if given amount is not a whole number set error message
        if (amount % 1 !== 0 || amount <= 0) {
            setErrorMessage('Amount must be greater than 0 and a whole number');
        }
        else {

            //setLoading(true) starts the ClipLoader icon
            setLoading(true);

            setSuccessMessage('');

            try {
                //tries to make transaction
                const response = await axios.post('/transaction',
                    JSON.stringify({ account1_accountNumber: account1, account2_accountNumber: account2, amount, method: "transfer" }),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + user.accessToken
                        },
                        withCredentials: true
                    });

                //latency fot circle icon
                setTimeout(() => {
                    setLoading(false);
                }, 1000);

                setSuccessMessage('Transaction Successful!');

                //setUpdate(true) result in making an request to server for getting updated account information
                setUpdate(true);


            } catch (error) {
                setLoading(false);

                //when refresh token is not valid reroute to main
                if(error.response.status === 403){
                    window.location.href = "http://localhost:3000/main"
                }

                else if (!error?.response) {
                    setErrorMessage('No Server Response');
                }
                else if (error.response?.status === 409) {
                    setErrorMessage('Transaction Not Allowed');
                }
                else if (error.response?.status === 400) {
                    setErrorMessage('Account Numbers And Amount Required');
                }
                else if (error.response?.status === 406) {
                    setErrorMessage('Balance Too Low');
                }
                else {
                    setErrorMessage('Transaction Failed');
                }
            }
        }
    }

    return (
        <div className="makeTransaction">
            <button onClick={handleOpen}>
                <FontAwesomeIcon icon={faMoneyBillTransfer} />
            </button>
            <p>Transfer</p>
            <Dialog open={open}>
                <DialogTitle sx={{ pb: 0 }}>Transfer</DialogTitle>
                {successMessage !== ''
                    ? <div className="successTransfer">
                        {successMessage}
                    </div>
                    : <div className="errorTransfer">
                        {errorMessage}
                    </div>
                }
                <DialogContent>
                    <Box
                        noValidate
                        component="form"
                        maxWidth='sm'
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}
                    >
                        <FormControl sx={{ width: 300, mt: 0, pt: 0 }}>
                            <InputLabel htmlFor="account1">From</InputLabel>
                            <Select
                                value={account1}
                                label="account1"
                                onChange={(e) => setAccount1(e.target.value)}
                                sx={{ mb: 1.2 }}
                            >
                                <MenuItem value={debit}>Debit: {debit} {debitBalance}€</MenuItem>
                                {credit && <MenuItem value={credit}>Credit: {credit} {creditBalance}€</MenuItem>}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ mt: 1 }}>
                            <TextField type="search" label="To" onChange={(e) => setAccount2(e.target.value)} sx={{ mb: 1.2 }} required />
                        </FormControl>
                        <FormControl sx={{ mt: 1 }}>
                            <InputLabel htmlFor="amount">Amount</InputLabel>
                            <OutlinedInput
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                startAdornment={<InputAdornment position="start">€</InputAdornment>}
                                label="Amount"
                            />
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <button className='transferButton1' onClick={handleClose}>Close</button>
                    {loading
                        ? <ClipLoader loading={loading} size={20} color="#00ff00" />
                        : <button className='transferButton2' onClick={handleTransaction}>Make Transaction</button>
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Transfer;