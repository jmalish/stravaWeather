let activityID;


checkForToken(function (response) {

});





// getCurrentURL(function (url) {
//     if (url === "https://www.strava.com/dashboard") {
//         // addDivsToDashboardPage();
//     } else if (url.split("strava.com/")[1].split('/')[0] === "activities") {
//         getActivityId(url, function (actId) {
//             activityID = actId;
//             console.log("Activities page for activity ID " + actId);
//         });
//     }
// });


function getCurrentURL(callback) {
    chrome.runtime.sendMessage({message: "getURL"}, function(response) {
        callback(response);
    });
}

function getActivityId(url, callback) {
    callback(url.split('activities/')[1]);
}

function addDivsToDashboardPage() {
    let activityCards = document.getElementsByClassName('activity');
    for (let i = 0; i < activityCards.length; i++) {
        // addDiv(i);
    }
}

function addDiv(i) {
    let activityID = activityCards[i].id.split("-")[1]; // get ID from element

    let mediaDiv = activityCards[i].getElementsByClassName("entry-body")[0].getElementsByClassName("media")[0]; // get the media div inside the entry-body div

    let weatherDiv = document.createElement('div'); // create our weather div
    weatherDiv.innerHTML = '<p>This is my div!</p>'; // input html of our div
    weatherDiv.className = "stravaWeather"; // give our div a name

    mediaDiv.parentNode.insertBefore(weatherDiv, mediaDiv.nextSibling); // insert our weather div after the media div
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
