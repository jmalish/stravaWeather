var xhrq = require("xmlhttprequest").XMLHttpRequest;
var xhr = new xhrq();

var url = "https://www.strava.com/oauth/authorize?client_id=24632&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=auto&scope=public";
// url = 'strava.com';

xhr.open('GET', url, false);
xhr.onload = function () {
    console.log('test');
    console.log(xhr.responseURL);
};
xhr.send();