var activityCards = document.getElementsByClassName('activity');

thisTest();


for (var i = 0; i < activityCards.length; i++) {
    var activityID = activityCards[i].id.split("-")[1]; // get ID from element

    var mediaDiv = activityCards[i].getElementsByClassName("entry-body")[0].getElementsByClassName("media")[0]; // get the media div inside the entry-body div

    var weatherDiv = document.createElement('div'); // create our weather div
    weatherDiv.innerHTML = '<p>This is my div!</p>'; // input html of our div
    weatherDiv.className = "stravaWeather"; // give our div a name

    mediaDiv.parentNode.insertBefore(weatherDiv, mediaDiv.nextSibling); // insert our weather div after the media div
}

function thisTest() {
    chrome.runtime.sendMessage({getCode: "code"}, function(response) {
        console.log(response.code);
    });
}

