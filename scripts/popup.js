var oldResponse = "hey"

  chrome.runtime.sendMessage({text: oldResponse}, function(response) {
    chatGPTRequest("ce parere ai de: " + response +" ?" )
    console.log("Response: ", response);
});


const urlReq = "http://localhost:3000";

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
            "Do not offer a credit if the requestor has more expenses than income, but offer financial advice to improve their financial situation",
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
