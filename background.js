let accessToken, code, secrets;

startup();

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function startup() {
    getSecrets(function () {
        // getWeather(37,-76,"20180401", function (data) {
        //     console.log(data);
        // });
    });

    getItemFromStorage("swAccessToken", function (response) { // first thing, attempt to get access token
        let newToken = response.swAccessToken; // for sake of ease
        if (newToken) { // if the token is not undefined, we can store it
            accessToken = newToken; // update the variable
        } // if it is undefined, we'll deal with that later
    });

    // This block just makes the icon colored, to indicate it's working on the page
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'www.strava.com'}})
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });

    // add listener so we can receive messages from the content script
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            switch(request.message) {
                case "checkToken":
                    if (accessToken) {
                        sendResponse(true);
                    } else {
                        sendResponse(false);
                    }
                    break;

                case "newToken":
                    getNewUserAccessToken(function (newToken) {
                        accessToken = newToken;
                        sendResponse(true);
                    });
                    break;

                case "getURL":
                    chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
                        // console.log(tab[0].url);
                        sendResponse(tab[0].url);
                    });
                    break;

                case "popupOpened":
                    if (accessToken) {
                        sendResponse(true);
                    } else {
                        sendResponse(false);
                    }
                    break;

                case "getPopupSettings":
                    let popupSettings = {"temp": "f", "windspeed": "i"};
                    getItemFromStorage("swSettingsTemp", function (response) {
                        if (response.swSettingsTemp) {
                            popupSettings.temp = response.swSettingsTemp;
                        }
                        getItemFromStorage("swSettingsWind", function (response) {
                            if (response.swSettingsWind) {
                                popupSettings.windspeed = response.swSettingsWind;
                            }
                            sendResponse(popupSettings);
                        })
                    });

                    break;

                case "updateSettings":
                    setItemInStorage("swSettingsTemp", request.temp);
                    setItemInStorage("swSettingsWind", request.windSpeed);
                    sendResponse(true);
                    break;

                case "getWeather":
                    getWeather(request.activityId, function (weather) {
                        sendResponse(weather);
                    });
                    break;

                default:
                    console.log("No response for message: " + request.message);
            }
            return true;
        });
}

function getNewUserCodeFromAuth(callback) {
    let url = "https://www.strava.com/oauth/authorize?client_id=24632&response_type=code&approval_prompt=auto&scope=public&redirect_uri=";
    let redirectURL = url + chrome.identity.getRedirectURL();

    let options = {
        'interactive': true,
        'url': redirectURL
    };

    chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
        if (!redirectUri) { // if this is undefined, user didn't approve access, or some other error
            callback(false);
        } else { // if we did get through
            let newCode = redirectUri.split("code=")[1]; // grab the code from the redirected URL

            setItemInStorage("swUserCode", newCode);
            callback(newCode);
        }
    });
}

function setItemInStorage(key, value) {
    chrome.storage.sync.set({[key]: value}, function () {
        return true;
    });
}

function getItemFromStorage(key, callback) {
    chrome.storage.sync.get([key], function (storage) {
        callback(storage);
    });
}

function getNewUserAccessToken(callback) {
    getItemFromStorage("swUserCode", function (response) {
        code = response.swUserCode;
        getSecrets(function () {
            getUserAccessToken(function (token) {
                setItemInStorage("swAccessToken", token);
                callback(token);
            });
        });
    });
}

function getUserAccessToken(callback) {
    let params = {
        "client_id": secrets.client_id,
        "client_secret": secrets.client_secret,
        "code": code
    };

    // console.log(params);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(JSON.parse(xhr.responseText).access_token);
        }
    };
    xhr.open("POST", "https://www.strava.com/oauth/token", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    if (!code) {
        getNewUserCodeFromAuth(function (newCode) {
            params.code = newCode;
            code = newCode;

            xhr.send(JSON.stringify(params));
        });
    } else {
        xhr.send(JSON.stringify(params));
    }
}

function getSecrets(callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            secrets = JSON.parse(xhr.responseText);

            callback(secrets);
        }
    };
    xhr.open("GET", chrome.runtime.getURL('secrets.json'), true);
    xhr.send();
}

function getActivityData(activityID, callback) {
    let url = "https://www.strava.com/api/v3/activities/" + activityID +
        "?access_token=" + accessToken;

    // console.log(url);

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send();
}

function getWeather(activityId, callback) {
    getActivityData(activityId, function (activity) {
        let date = new Date(activity.start_date);

        console.log(date);
        let response = {
            weather: undefined,
            activityDate: activity.start_date
        };

        formatDate(date, function (_date) {
            let url = "http://api.wunderground.com/api/" + secrets.wundergroundKey + "/history_" +
                _date + "/q/" + activity.start_latitude + "," + activity.start_longitude + ".json";

            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    response.weather = JSON.parse(xhr.responseText).history;

                    callback(response);
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        });
    });
}

function formatDate(date, callback) {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    callback(date.getFullYear() + month + day);
}