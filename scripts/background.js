chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.text === "scriptus") {
        console.log(request.message);
    }
});

let infus;

// Function to handle the context menu click event
async function handleContextMenuClick(info, tab) {
    infus = info;
    // Perform the desired action when the menu item is clicked
    chrome.windows
        .create({
            url: "../ui/popup.html",
            focused: true,
            type: "popup",
            width: 600,
            height: 800
        })
        .then(async () => {
            chrome.runtime.onMessage.addListener(function listener(
                msg,
                sender,
                sendResponse
            ) {
                console.log(
                    "Received %o from %o, frame",
                    msg,
                    sender.tab,
                    sender.frameId
                );
                sendResponse(infus.selectionText);
            });

            console.log("Context menu item clicked!");
            console.log("Selected text:", info.selectionText);
            console.log("Page URL:", info.pageUrl);
        });
}

// Create a context menu item
chrome.contextMenus.create({
    id: "myContextMenu",
    title: "Intreabă-l pe Vali",
    contexts: ["selection", "page"],
});

chrome.contextMenus.create({
    id: "myContextMenu",
    title: "Amintește-mi, Vali!",
    contexts: ["selection", "page"],
});

chrome.contextMenus.create({
    id: "myContextMenu2",
    title: "Ajută cu feedback!",
    contexts: ["selection", "page"],
});

// Add a listener for the context menu item click event
chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

chrome.runtime.onInstalled.addListener(function () {
    // Function to execute in the active tab
});
