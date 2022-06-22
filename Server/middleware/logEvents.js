const Events = require('../models/Events');

const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const logEvents = async (message) => {
    const dateTime = `${format(new Date(), 'dd/MM/yyyy\tHH:mm:ss')}`;
    const logItem = `${uuid()}\t${message}\n`;

    try{
        const result = await Events.create({
            'date': new Date(),
            'logItem': logItem
        });

    } catch(err){
        console.log(err);
    }

}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`);
    next();
}

module.exports = { logEvents, logger};