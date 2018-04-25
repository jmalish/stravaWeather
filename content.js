checkForToken(function (response) {
    getCurrentURL(function (url) {
        if (url === "https://www.strava.com/dashboard") {
            addDivsToDashboardPage();

        } else if (url.split("strava.com/")[1].split('/')[0] === "activities") {
            getActivityId(url, function (actId) {
                // console.log("Activities page for activity ID " + actId);
            });
        }
    });
});



// ~~~~~~~~~~~~~~~~~~~~~~
function getCurrentURL(callback) {
    chrome.runtime.sendMessage({message: "getURL"}, function(response) {
        callback(response);
    });
}

function getActivityId(url, callback) {
    let activityID = url.split('activities/')[1];

    if (activityID.includes('/')) {
        callback(activityID.split('/')[0]);
    } else {
        callback(activityID);
    }
}

function addDivsToDashboardPage() {
    let activityCards = document.getElementsByClassName('activity');
    // for (let i = 0; i < activityCards.length; i++) {
    //     addDiv(activityCards[i]);
    // }

    addDiv(activityCards[0]);
}

function addDiv(activityCard) {
    let activityID = activityCard.id.split("-")[1]; // get ID from element
    activityCard.className += " sw";

    getWeatherForActivity(activityID, function (weather) {

        console.log(weather);

        let mediaDiv = activityCard.getElementsByClassName("entry-body")[0].getElementsByClassName("media")[0]; // get the media div inside the entry-body div

        let weatherDiv = document.createElement('div'); // create our weather div
        weatherDiv.className = "stravaWeather"; // give our div a name
        weatherDiv.innerHTML =
            "<p>This is my div!</p>"; // input html of our div


        mediaDiv.parentNode.insertBefore(weatherDiv, mediaDiv.nextSibling); // insert our weather div after the media div
    });
}

// function getUserCode(callback) {
//     chrome.runtime.sendMessage({message: "retrieveCode"}, function(response) {
//         callback(response);
//     });
// }
//

function getNewTokenFromAuth() {
    chrome.runtime.sendMessage({message: "newToken"}, function(response) {

    });
}

function checkForToken(callback) {
    chrome.runtime.sendMessage({message: "checkToken"}, function (response) {
        callback(response);
    });
}

function getWeatherForActivity(activityId, callback) {
    chrome.runtime.sendMessage({message: "getWeather", "activityId": activityId}, function(response) {
        callback(response)
    });
}
