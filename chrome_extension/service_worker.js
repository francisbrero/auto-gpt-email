let active_tab_id = 0;

chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, current_tab_info => {
        active_tab_id = tab.tabId;
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'yo check the storage') {
        chrome.tabs.sendMessage(active_tab_id, { message: 'yo i got your message' })
    }
    else if (request.message === "sendApiCall") {
        sendApiCall(request.data);
        return true;
    }
    return true;
});

//Function to send a message. Usually to the content.js file
function send(text) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(active_tab_id, text, function (response) {
            console.log(response);
        });
    });
}


async function sendApiCall(data) {
    send("loading");
    const response = await fetch('https://82ba-73-158-184-215.ngrok.io/webhook', {
    method: 'POST',
    body: data,
    headers: {
        'Content-Type': 'application/json'
    }
  });
    const res = await response.json();
    console.log("response :" + res);
    chrome.tabs.sendMessage(active_tab_id, { message: 'API Response', data: JSON.stringify(res) })
};