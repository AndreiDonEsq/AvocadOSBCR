chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "background_to_popup") {
        alert(request.message);
    }
});
