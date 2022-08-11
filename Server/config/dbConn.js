const mongoose = require('mongoose');

//try connecting to database
const connectDB = async () => {
    try {
            mongoose.connect("mongodb+srv://User:User123@cluster0.2rejepf.mongodb.net/WB?retryWrites=true&w=majority", {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch(err) {
        console.error(err);
    }
}

module.exports = connectDB;