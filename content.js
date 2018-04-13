var activityCards = document.getElementsByClassName('activity');
var userCode;


getUserCode(function(newCode) {
    userCode = newCode;
});


for (var i = 0; i < activityCards.length; i++) {
    // addDiv();
}

function addDiv() {
    var activityID = activityCards[i].id.split("-")[1]; // get ID from element

    var mediaDiv = activityCards[i].getElementsByClassName("entry-body")[0].getElementsByClassName("media")[0]; // get the media div inside the entry-body div

    var weatherDiv = document.createElement('div'); // create our weather div
    weatherDiv.innerHTML = '<p>This is my div!</p>'; // input html of our div
    weatherDiv.className = "stravaWeather"; // give our div a name

    mediaDiv.parentNode.insertBefore(weatherDiv, mediaDiv.nextSibling); // insert our weather div after the media div
}

function getUserCode(callback) {
    chrome.runtime.sendMessage({getAuthCode: "retrieve"}, function(response) {
        callback(response.code);
    });
}

