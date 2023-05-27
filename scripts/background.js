chrome.browserAction.onStartup.addListener(currentURLRetriver);
async function currentURLRetriver() {
    chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
        const currentTab = tabs[0];
        const currentURL = currentTab.url;
        alert("Current URL: " + currentURL);
    });
};

// Function to execute when the extension button is clicked
function getActiveTabData() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'extractData' }, function (response) {
        // Process the received data
        console.log('Received data:', response.data);
      });
    });
  }
  
  // Listen for clicks on the extension button
  chrome.browserAction.onClicked.addListener(getActiveTabData);
  
  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'sendData') {
      // Process the received data
      console.log('Received data:', message.data);
  
      // You can send a response back to the content script if needed
      sendResponse({ response: 'Data received successfully!' });
    }
  });