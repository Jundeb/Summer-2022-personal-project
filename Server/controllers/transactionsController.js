const { default: mongoose } = require('mongoose');
const User = require('../models/User');

const transferHandler = async (req, res) => {
    const session = await mongoose.startSession();
    
    const account1 = req.body.account1;
    const account2 = req.body.account2;
}