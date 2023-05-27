const cashbackBtn = document.getElementById("cashbackToggleButton");
const vbCuValiBtn = document.getElementById("vbCuValiButton");
document.addEventListener("DOMContentLoaded", function () {
    cashbackBtn.addEventListener("click", onCashbackToggle);
    vbCuValiBtn.addEventListener("click", createUserMessage);
});

function extractData() {
    var data = 'Data you want to extract';
    
    // Send the extracted data to the background script
    chrome.runtime.sendMessage({ action: 'sendData', data: data });
    console.log(data)
  }
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'extractData') {
      // Call the function to extract data
      extractData();
    }
  });

const urlReq = "http://localhost:3000";

const messages = [
    {
        role: "system",
        content:
            "You must respond as a financial assistant named Vali, working for 'team AvocadOS'. " +
            "Please respond in Romanian as that is our target group. " +
            "Give clear answers, however try to act a little bit like a salesman as well. "+
            "Ask details about the requestor's monthly income and expenses",
    },
];

async function chatGPTRequest(message) {
    messages.push({
        role: "user",
        content: message,
    });

    const res = await fetch(urlReq + "/api/chat", {
        method: "POST",
        body: JSON.stringify(messages),
    })
        .then((resp) => resp.json())
        .then((data) => {
            messages.push(data);
            _createValiMessage(data.content);
        });
}

//Check if cashback verification is active
let URLRetrievalRunning = false;

async function createUserMessage() {
    /*
        entireMessageDiv
            authorDiv
                authorSpan
            divider1
            messageDiv
            divider2
            timeDiv
    */
    const entireMessageDiv = document.createElement("div");
    document.getElementById("messages_container").appendChild(entireMessageDiv);
    entireMessageDiv.classList.add(
        "chat-log_item",
        "chat-log_item-own",
        "z-depth-0"
    );

    const authorDiv = document.createElement("div");
    entireMessageDiv.appendChild(authorDiv);
    authorDiv.classList.add(
        "row",
        "justify-content-end",
        "mx-1",
        "d-flex",
        "col-auto",
        "px-0"
    );

    const authorSpan = document.createElement("span");
    authorDiv.appendChild(authorSpan);
    authorSpan.classList.add("chat-log_author");
    authorSpan.innerHTML = "You";

    const divider1 = document.createElement("hr");
    entireMessageDiv.appendChild(divider1);
    divider1.classList.add("my-1", "py-0", "col-8");

    const messageDiv = document.createElement("div");
    entireMessageDiv.appendChild(messageDiv);
    messageDiv.classList.add("chat-log_message");

    //Read textArea content, set it as message. This will later be sent to ChatGPT.
    const messageContent = document.getElementById("messageTextArea").value;
    messageDiv.innerHTML = messageContent;
    chatGPTRequest(messageContent);
    //Don't foregt to clear the textarea
    document.getElementById("messageTextArea").value = "";

    const divider2 = document.createElement("hr");
    entireMessageDiv.appendChild(divider2);
    divider2.classList.add("my-1", "py-0", "col-8");

    //Get current date time and add them
    let currentDate = new Date(),
        currentHour = String(currentDate.getHours()),
        currentMinute = String(currentDate.getMinutes());
    currentHour = currentHour.length === 1 ? "0" + currentHour : currentHour;
    currentMinute =
        currentMinute.length === 1 ? "0" + currentMinute : currentMinute;
    const timeDiv = document.createElement("div");
    entireMessageDiv.appendChild(timeDiv);
    timeDiv.classList.add(
        "row",
        "chat-log_time",
        "m-0",
        "p-0",
        "justify-content-end"
    );
    timeDiv.innerHTML = `${currentHour}:${currentMinute}`;
}

async function _createValiMessage(sText) {
    /*
        entireMessageDiv
            authorDiv
                authorSpan
            divider1
            messageDiv
            divider2
            timeDiv
    */
    const entireMessageDiv = document.createElement("div");
    document.getElementById("messages_container").appendChild(entireMessageDiv);
    entireMessageDiv.classList.add("chat-log_item", "z-depth-0");

    const authorDiv = document.createElement("div");
    entireMessageDiv.appendChild(authorDiv);
    authorDiv.classList.add(
        "row",
        "justify-content-end",
        "mx-1",
        "d-flex",
        "col-auto",
        "px-0"
    );

    const authorSpan = document.createElement("span");
    authorDiv.appendChild(authorSpan);
    authorSpan.classList.add("chat-log_author_vali");
    authorSpan.innerHTML = "Vali";

    const divider1 = document.createElement("hr");
    entireMessageDiv.appendChild(divider1);
    divider1.classList.add("my-1", "py-0", "col-8");

    const messageDiv = document.createElement("div");
    entireMessageDiv.appendChild(messageDiv);
    messageDiv.innerHTML = sText;

    const divider2 = document.createElement("hr");
    entireMessageDiv.appendChild(divider2);
    divider2.classList.add("my-1", "py-0", "col-8");

    //Get current date time and add them
    let currentDate = new Date(),
        currentHour = String(currentDate.getHours()),
        currentMinute = String(currentDate.getMinutes());
    currentHour = currentHour.length === 1 ? "0" + currentHour : currentHour;
    currentMinute =
        currentMinute.length === 1 ? "0" + currentMinute : currentMinute;
    const timeDiv = document.createElement("div");
    entireMessageDiv.appendChild(timeDiv);
    timeDiv.classList.add(
        "row",
        "chat-log_time_vali",
        "m-0",
        "p-0",
        "justify-content-end"
    );
    timeDiv.innerHTML = `${currentHour}:${currentMinute}`;
}

async function onCashbackToggle() {
    if (cashbackBtn.textContent.includes("ON")) {
        cashbackBtn.textContent = "Cashback OFF";
        URLRetrievalRunning = true;
    }
    if (cashbackBtn.textContent.includes("OFF")) {
        cashbackBtn.textContent = "Cashback ON";
        _currentURLRetriever();
        URLRetrievalRunning = false;
    }
}

async function _currentURLRetriever() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const currentURL = currentTab.url;
        userAction(currentURL);
        alert("Current URL: " + currentURL);
    });
}

const userAction = async (url) => {
    const normalisedUrl = new URL(url);

    const data = {
        url: normalisedUrl.host,
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "chrome-extension": "//dhgbflmciegpmknahfplcnofcgbgfjge",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin":
                "chrome-extension://dhgbflmciegpmknahfplcnofcgbgfjge",
        },
        body: JSON.stringify(data),
    };

    fetch(urlReq + "/api/partner", options)
        .then((response) => response.json())
        .then((data) => {
            data.rows.forEach((element) => {
                if (element.name == normalisedUrl.host) {
                    _createValiMessage(
                        `Ai Vali moneyback pentru ${element.name}, economiseste ${element.procent}% la cumparaturile tale cu cea mai tare extensie de banking`
                    );
                }
            });
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};