var request = require('request');
var fs = require('fs');
var secrets = JSON.parse(fs.readFileSync("secrets.json"));

var texas = 1493217824;
var virginia = 1493191517;

var url = "https://www.strava.com/oauth/authorize?client_id=24632&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=auto&scope=public";

function getUserCode(url) {
    var r = request.get(url, function (err, res, body) {
        console.log(r.uri.href);
        console.log(res.request.uri.href);
        console.log(this.uri.href);
    });
}

module.exports = {
    test: function (msg) {
        console.log(msg);
    },

    getStravaUserCode: function (url) {
        var r = request.get(url, function (err, res, body) {
            console.log(r.uri.href);
            console.log(res.request.uri.href);
            console.log(this.uri.href);
        });
    }
};


// 24632
// c252e432064d97d8b57f08bf597eba8232f4f4b7
// https://www.strava.com/oauth/authorize?client_id=24632&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=auto&scope=public
// myCode: 709323f5fbc823887567f4274af0fc375d908135
// brayt: ec4fb9e76f00740c7ecd3788eecd69fead04839c