const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const handleNewUser = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) return res.status(400).json({'message': 'Username and password required.'});

    //check for dublicate usernames in the db
    const dublicate = await User.findOne({ username: username}).exec();

    if(dublicate) return res.status(409).send('Username already exists'); //Conflict

    try{
        //encrypting the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //creating random string for account_number
        const randomString = crypto.randomBytes(6).toString('hex');

        //create and store the new user
        const result = await User.create({ 
            'username': username,
            'password': hashedPassword,

            //adding 1000 balance for every new user
            'bank_accounts': {
                'account_number': "FI"+randomString,
                'balance': 1000,
                'limit': 0
            }

        });
       
        res.status(200).send({'success': `New user created`});
    } catch(err) {
        res.status(500).json({'message': err.message});
    }
}

module.exports = { handleNewUser }