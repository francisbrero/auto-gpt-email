const sdkKey = 'sdk_test12_4ff1a33e18';

InboxSDK.load(1, sdkKey).then(function (sdk) {
  // Create the toolbar button
  sdk.Toolbars.registerToolbarButtonForThreadView({
    title: 'Auto Reply',
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/1693/1693746.png',
    iconClass: 'big',
    hasDropdown: false,
    // keyboardShortcutHandle: 'cmd+k',
    onClick: function (event) {
      sdk.Conversations.registerMessageViewHandler(function (messageView) {
        // Get the email's body
        const message = messageView.getBodyElement().innerText;
        // console.log(message);
        const action = 'reply';

        // Get the user's input on how to answer the email
        const prompt_text = prompt('How would you like to respond (Unsubscribe, context...):');


        const data = {
          action: action,
          user_input: prompt_text,
          message: message
        };
        // Send the data to the background.js file to run the API call
        chrome.runtime.sendMessage({message: 'sendApiCall', data: JSON.stringify(data)});
        
        //Register a listener to get the API response and add it to the email
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          // console.log("Request received "+ request.message);
          if (request == "loading") {
            console.log("loading");
          }
          else if (request == "success") {
            console.log("success");
          }
          else if (request.message == "API Response") {
            // Create a new email reponse and add the request.data as a reply in the body
            // For now we require there be an open ComposeView
            sdk.Compose.registerComposeViewHandler(function(composeView){
              composeView.setBodyText(JSON.stringify(request.data));
            });
            return true;
          }
          return true;
        });
      });      
    }
  });
});


