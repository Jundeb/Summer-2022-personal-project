require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

const PORT = process.env.PORT || 3500; 

//Connect to MongoDB
connectDB();

//Handle options credentials and
//and fetch cookies credentials requirement
//for some search engines
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

//built-in middleware to hande urlencoded form data
app.use(express.urlencoded({extended: false}));

//built-in middleware for json
app.use(express.json()); 

//middleware for cookies
app.use(cookieParser());

//routes
app.use('/register', require('./routes/registerRouter'));
app.use('/auth', require('./routes/authRouter'));
app.use('/refresh', require('./routes/refreshRouter'));
app.use('/logout', require('./routes/logoutRouter'));

//routes that require accessToken
app.use(verifyJWT);
app.use('/user', require('./routes/api/userRouter'));
app.use('/transaction', require('./routes/api/transactionRouter'));
app.use('/account', require('./routes/api/accountRouter'));
app.use('/info', require('./routes/api/personalInfoRouter'));

//handling errors
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


