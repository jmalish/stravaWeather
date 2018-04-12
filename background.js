console.log("Loaded!");

// var apiURL = "strava.jordanmalish.com";
var url = "https://www.strava.com/oauth/authorize?client_id=24632&response_type=code&approval_prompt=auto&scope=public&redirect_uri=";



var code;

getStravaUserCode(url);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.getCode !== "") {
            sendResponse({code: "I'm gettin' a code!"});
            // getStravaUserCode(url);
        }
    });

function xgetStravaUserCode(url) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
    xhr.setRequestHeader('content-type', 'text/plain');
    console.log(xhr.redirectUrl);
    xhr.onreadystatechange = function() {
        console.log(xhr.readyState);
        console.log(xhr.redirectUrl);
    };

    xhr.onprogress = function () {
        console.log(xhr.redirectUrl);
    };

    xhr.send();
}

function getStravaUserCode(url) {
    if (code) {
        return code;
    }

    url = url + chrome.identity.getRedirectURL();

    console.log(url);
    var options = {
        'interactive': true,
        'url': url
    };

    chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
        code = redirectUri.split("code=")[1];
        console.log("User code = " + code);
    });
}