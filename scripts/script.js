const cashbackBtn = document.getElementById("cashbackToggleButton");
document.addEventListener("DOMContentLoaded", function () {
    cashbackBtn.addEventListener("click", onCashbackToggle);
});

let URLRetrievalRunning = false;
async function onCashbackToggle() {
    if(cashbackBtn.textContent.includes("ON")){
        cashbackBtn.textContent = "Cashback OFF";
        URLRetrievalRunning = true;
    }
    if(cashbackBtn.textContent.includes("OFF")){
        cashbackBtn.textContent = "Cashback ON";
        _currentURLRetriever();
        URLRetrievalRunning = false;
    }
}

async function _currentURLRetriever() {
    chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
        const currentTab = tabs[0];
        const currentURL = currentTab.url;
        alert("Current URL: " + currentURL);
    });
};
