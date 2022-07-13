const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//muokkaa tätä devin jälkeen
const transactionSchema = new Schema({
    from: String,
    to: String,
    amount: Number,
    date: String,
    transaction_name: String,
});

const bank_accountSchema = new Schema({
    account_number: {
        type: String,
        default: ''
    },
    balance: {
        type: Number,
        default: 0
    },
    limit: {
        type: Number,
        default: 0
    },
    transactions: [transactionSchema]
        
        
    
});

const userSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    roles: {
        User: {
            type: Number,
            default: 1234
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },

    refreshToken: String,

    personal_info: {
        firstname: {
            type: String,
            default: ''
        },
        lastname: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        phonenumber: {
            type: String,
            default: ''
        }
    },

    bank_accounts: {
        type: [bank_accountSchema],
        default: () => ({})
    }
       
});

module.exports = mongoose.model('User', userSchema);