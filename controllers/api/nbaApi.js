const axios = require("axios");
const btoa = require("btoa");
require('dotenv').config();



axios.get({
    method: 'get',
    url: 'https://api.mysportsfeeds.com/v1.0/pull/nhl/2018-2019-regular/full_game_schedule.json',


}).then(function(res){



})

