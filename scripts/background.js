chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "popup_to_background") {
        console.log(request.message);
    }
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, 'hi'), { message: "background_to_content" };
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "content_to_background") {
        console.log(request.message);
    }
});

// Function to handle the context menu click event
function handleContextMenuClick(info, tab) {
    // Perform the desired action when the menu item is clicked
    chrome.windows.create({
        url : "../ui/popup.html",
        focused : true,
        type : "popup"});
    console.log("Context menu item clicked!");
    console.log("Selected text:", info.selectionText);
    console.log("Page URL:", info.pageUrl);
}

// Create a context menu item
chrome.contextMenus.create({
    id: "myContextMenu",
    title: "Intreaba-l pe Vali",
    contexts: ["selection", "page"],
});

chrome.contextMenus.create({
    id: "myContextMenu2",
    title: "Intreaba-l pe Vali evirom",
    contexts: ["selection", "page"],
});

// Add a listener for the context menu item click event
chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

chrome.runtime.onInstalled.addListener(function () {
    // Function to execute in the active tab
});
