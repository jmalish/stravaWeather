console.log("Loaded!");

var apiURL = "strava.jordanmalish.com";
var url = "https://www.strava.com/oauth/authorize?client_id=24632&response_type=code&redirect_uri=http://" +
    apiURL + "&approval_prompt=auto&scope=public";



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


    var options = {
        'interactive': true,
        'url': url
    };

    // chrome.identity.launchWebAuthFlow(options, function (responseUrl) {
    //     console.log('launchWebAuthFlow completed', chrome.runtime.lastError,
    //         responseUrl);
    //
    //     if (chrome.runtime.lastError) {
    //         callback(new Error(chrome.runtime.lastError));
    //     }
    // });

    chrome.identity.launchWebAuthFlow(options, function(redirectUri) {
        console.log(options.url);
        console.log('launchWebAuthFlow completed', chrome.runtime.lastError,
            redirectUri);

        if (chrome.runtime.lastError) {
            callback(new Error(chrome.runtime.lastError));
            return;
        }

        // Upon success the response is appended to redirectUri, e.g.
        // https://{app_id}.chromiumapp.org/provider_cb#access_token={value}
        //     &refresh_token={value}
        // or:
        // https://{app_id}.chromiumapp.org/provider_cb#code={value}
        var matches = redirectUri.match(redirectRe);
        if (matches && matches.length > 1)
            handleProviderResponse(parseRedirectFragment(matches[1]));
        else
            callback(new Error('Invalid redirect URI'));
    });
}