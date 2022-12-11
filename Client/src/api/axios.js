import axios from 'axios';

export default axios.create({
    //after dev change to ex. https://backend-junnukyro.herokuapp.com/
   // when testing change to http://localhost:3500/
    baseURL : 'https://webbank-backend.onrender.com/'
});