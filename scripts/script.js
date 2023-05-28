const cashbackBtn = document.getElementById("cashbackToggleButton");
const vbCuValiBtn = document.getElementById("vbCuValiButton");

const urlReq = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
    cashbackBtn.addEventListener("click", onCashbackToggle);
    vbCuValiBtn.addEventListener("click", createUserMessage);
});

function getElementByClass(className) {
    const elements = document.getElementsByClassName(className);
    return elements.length > 0 ? elements[0] : null;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "background_to_content") {
        console.log(request.message);
    }
});

chrome.runtime.sendMessage({
    message: "content_to_background",
    data: "any_data",
});

const messages = [
    {
        role: "system",
        content:
            "You must respond as a financial assistant named Vali, working for 'team AvocadOS'. " +
            "Please respond in Romanian as that is our target group. " +
            "Give clear answers, however try to act a little bit like a salesman as well. " +
            "Ask the person if they want to buy something. " +
            "You don't represent a shop. " +
            "Based on what the person wants to buy, aproximate the price of that item. " +
            "Ask details about the requestor's monthly income and expenses, but wait for questions regarding credits first. " +
            "A requestor's credit must be less than 40 percent of their income. " +
            "Do not offer a credit if the requestor has more expenses than income, but offer financial advice to improve their financial situation. " +
            "We offer cash back or money back option",
           
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

// chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
//     if (request.method == "getSelection")
//       console.log({data: window.getSelection().toString()});
//     else
//     console.log({}); // snub them.
// });

async function _currentURLRetriever() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const currentURL = currentTab.url;
        _proceedToSendURLMessage(currentURL);
    });
}

const _proceedToSendURLMessage = async (url) => {
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
                    const randomValiMessages = [
                        `Descoperă beneficiile Vali Moneyback! Economisești ${element.procent}% la achizițiile tale pentru ${element.name} cu ajutorul celei mai avansate extensii de banking.`,
                        `Vrei să economisești bani la cumpărături? Cu Vali Moneyback, poți obține ${element.procent}% reducere pentru ${element.name}, folosind cea mai inovatoare extensie de banking disponibilă.`,
                        `Descoperă avantajele utilizării Vali Moneyback! Cu această extensie revoluționară de banking, ai posibilitatea să economisești ${element.procent}% la orice achiziție pentru ${element.name} pe care o faci.`,
                        `Transformă-ți cumpărăturile în economii cu Vali Moneyback! Cu cea mai tare extensie de banking de pe piață, poți economisi ${element.procent}% la fiecare achiziție pentru ${element.name} pe care o faci."`,
                        `Economisește mai mulți bani cu Vali Moneyback! Folosind extensia de banking cea mai avansată, primești ${element.procent}% reducere la toate cumpărăturile tale pentru ${element.name}.`,
                        `Descoperă Vali Moneyback și bucură-te de economii instant la cumpărăturile tale pentru ${element.name}! Folosește extensia de banking inovatoare pentru a obține o reducere de ${element.procent}% la fiecare achiziție.`,
                        `Ai auzit de Vali Moneyback? Cu această extensie inteligentă de banking, economisești ${element.procent}% la toate cumpărăturile tale pentru ${element.name}, făcute într-un mod ușor și convenabil.`,
                        `Transformă-ți cumpărăturile într-o experiență mai avantajoasă cu Vali Moneyback! Obține ${element.procent}% cashback la fiecare achiziție pentru ${element.name}, utilizând extensia de banking cea mai performantă de pe piață.`,
                        `Economisește mai mult cu Vali Moneyback! Cu ajutorul celei mai tari extensii de banking, primești o reducere de ${element.procent}% la toate achizițiile tale pentru ${element.name}, oferindu-ți mai multă putere de cumpărare.`,
                        `Descoperă cum să economisești bani cu Vali Moneyback! Utilizând extensia de banking inovatoare, primești ${element.procent}% reducere la cumpărăturile tale pentru ${element.name}, asigurându-ți cea mai bună ofertă disponibilă.`,
                    ];
                    _createValiMessage(
                        randomValiMessages[
                            Math.floor(
                                Math.random() * randomValiMessages.length
                            )
                        ]
                    );
                }
            });
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};
