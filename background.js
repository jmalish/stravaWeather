var code = getUserCodeFromStorage();

console.log(code);
// startup();
// getStravaUserCode();

function startup() {
    console.log("Hi! My ID is " + chrome.runtime.id);

    if (!code) { // if the code is null or whatever, it doesn't exist in storage
        // getNewUserCodeFromAuth(function(newCode) {
        //     if (!newCode) { // if newCode is not false, we have something to put into storage
        //         code = newCode;
                
        //         setCodeInStorage(code, function() {});
        //     }
        // });
    }

    // This block just makes the icon colored, to indicate it's working on the page
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

    // add listener so we can recieve messages from the content script
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.getAuthCode === "retrieve") {
                if (!code) {  // code has not be retrieved from storage yet

                }
                else {

                }
            }
        });
}


function getNewUserCodeFromAuth(callback) {
    var url = "https://www.strava.com/oauth/authorize?client_id=24632&response_type=code&approval_prompt=auto&scope=public&redirect_uri=";
    var redirectURL = url + chrome.identity.getRedirectURL();

    var options = {
        'interactive': true,
        'url': redirectURL
    };

    chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
        if (!redirectUri) { // if this is undefined, user didn't approve access, or some other error
            console.log("No permission given :(");

            callback(false);
        } else { // if we did get through
            code = redirectUri.split("code=")[1]; // grab the code from the redirected URL
            console.log("User code = " + code);

            callback(code);
        }
    });
}

function setCodeInStorage(userCode, callback) {
    chrome.storage.sync.set({"swUserCode": userCode}, function () {
        callback(true);
    });
}

function getUserCodeFromStorage(callback) {
    chrome.storage.sync.get(["swUserCode"], function (storage) {
        callback(storage.swUserCode);
    });
}