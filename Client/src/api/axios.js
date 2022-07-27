import axios from 'axios';

export default axios.create({
    //after dev change to ex. https://webbank-junnukyro.herokuapp.com/
   // after build change to http://localhost:3500/
    baseURL : 'http://localhost:3500/'
});