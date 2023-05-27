chrome.browserAction.onClicked.addListener(currentURLRetriver);
async function currentURLRetriver() {
    chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
        const currentTab = tabs[0];
        const currentURL = currentTab.url;
        alert("Current URL: " + currentURL);
    });
};