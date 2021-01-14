const moment = require('moment');

function formatMessage(username, text){
    return{
        username,
        text,
        time: moment().format('h:mm a')    //format hour:minute AM/PM
    }
}

module.exports = formatMessage;