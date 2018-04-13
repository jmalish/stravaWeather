console.log("Hi! My ID is " + chrome.runtime.id);
console.log("css disabled");

// var apiURL = "strava.jordanmalish.com";
var code;


// startup();
// getStravaUserCode();
setCodeInStorage("newCode");
getUserCodeFromStorage();



function startup() {
    console.log("running startup");
    chrome.runtime.onInstalled.addListener(function() {
        chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
            chrome.declarativeContent.onPageChanged.addRules([{
                conditions: [new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {hostEquals: 'www.strava.com'}
                })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }]);
        });
    });

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.getCode !== "") {
                sendResponse({code: "I'm gettin' a code!"});
                // getStravaUserCode(url);
            }
        });
}


function getStravaUserCode() {
    var url = "https://www.strava.com/oauth/authorize?client_id=24632&response_type=code&approval_prompt=auto&scope=public&redirect_uri=";
    var redirectURL = url + chrome.identity.getRedirectURL();

    var options = {
        'interactive': true,
        'url': redirectURL
    };

    chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
        if (!redirectUri) { // if this is undefined, user didn't approve access, or some other error
            console.log("No permission given :(");

            return false;
        } else { // if we did get through
            code = redirectUri.split("code=")[1]; // grab the code from the redirected URL
            console.log("User code = " + code);

            return true;
        }
    });
}

function setCodeInStorage(userCode) {
    chrome.storage.sync.set({"swUserCode": userCode}, function () {

    });
}

function getUserCodeFromStorage() {
    chrome.storage.sync.get(["swUserCode"], function (storage) {
        console.log(storage.swUserCode);
    });
}