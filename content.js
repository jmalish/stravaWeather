var activityCards = document.getElementsByClassName('activity');

var url = "https://www.strava.com/oauth/authorize?client_id=24632&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=auto&scope=public";

getStravaUserCode(url);

for (var i = 0; i < activityCards.length; i++) {
    var activityID = activityCards[i].id.split("-")[1]; // get ID from element

    var mediaDiv = activityCards[i].getElementsByClassName("entry-body")[0].getElementsByClassName("media")[0]; // get the media div inside the entry-body div

    var weatherDiv = document.createElement('div'); // create our weather div
    weatherDiv.innerHTML = '<p>This is my div4!</p>'; // input html of our div
    weatherDiv.className = "stravaWeather"; // give our div a name

    mediaDiv.parentNode.insertBefore(weatherDiv, mediaDiv.nextSibling); // insert our weather div after the media div
}



function getStravaUserCode(url) {
    // var r = request.get(url, function (err, res, body) {
    //     console.log(r.uri.href);
    //     console.log(res.request.uri.href);
    //     console.log(this.uri.href);
    // });
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.redirectUrl);
        }
    };
    xhr.send();
}

