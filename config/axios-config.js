const btoa = require('btoa');
require('dotenv').config();

const key = process.env.NBA_APIKEY
const pw = process.env.NBA_PASSWORD

const credentials = btoa(key + ':' + pw);

module.exports = {
    method: 'get',
    headers: {
        'Authorization': 'Basic ' + credentials
    },
    responseType: 'json'
};