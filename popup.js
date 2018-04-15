let loadingDiv = document.getElementsByClassName('loading')[0];
let authDiv = document.getElementsByClassName('authMsg')[0];
let settingsDiv = document.getElementsByClassName('settings')[0];
let tempSelect = document.getElementById('temp');
let windSpeedSelect = document.getElementById('windSpeed');
let saveSettingsBtn = document.getElementById('saveSettings');
let authBtn = document.getElementById('authBtn');

startup(function (response) { // runs every time popup is opened
    if (response) { // if this exists, settingsDiv is visible
        settings();
    } else { // otherwise auth button is visible
        auth();
    }
});


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function startup(callback) {
    chrome.runtime.sendMessage({message: "popupOpened"}, function(response) {
        loadingDiv.style.display = "none";
        if (response) { // if the response is 'true' then we already have an access token, no need to request authorization
            settingsDiv.style.display = "block";
        } else { // don't have access token, so need to get auth
            authDiv.style.display = "block";
        }

        callback(response);
    });
}

function auth() {
    // Auth Button stuff
    authBtn.onclick = function () {
        // do things when button is clicked


        window.close(); // close the popup
    };
}

function settings() {
    chrome.runtime.sendMessage({message: "getPopupSettings"}, function(response) {
        tempSelect.value = response.temp;
        windSpeedSelect.value = response.windspeed;
    });

    saveSettingsBtn.onclick = function () {
        chrome.runtime.sendMessage({message: "updateSettings", "temp": tempSelect.value, "windSpeed": windSpeedSelect.value},
            function() {
                window.close(); // close the popup
            });
    };
}