const bufferSize = 10;
const maxChatRows = 50;

let chatInput = undefined;
let chatContainer = undefined;
let currentMessage = undefined;
let previousMessages = [];
let codesToggled = false;

mp.events.add('chat:push', (message) => {
    // Check if the chat has been loaded
    if (chatContainer === undefined || chatInput === undefined) return;

    // Print the chat message
    printChatMessage(message);
});

mp.events.add('chat:clear', () => {
    // Clear the chat
    clearChat();
});

mp.events.add('chat:show', (toggle, faction) => {
    if (toggle) {
        // Show the chat
        focusChat();
        showButtons(faction);
        showCodes(faction);
    } else {
        // Hide the chat
        disableChatInput();
        hideButtons();
        hideCodes();
    }
});

mp.events.add('chat:activate', (toggle) => { });

var chatAPI =
{
	push: (text) => { },
	clear: () => { },
	activate: (toggle) => { },
	show: (toggle) => { }
};

$(document).ready(function() {
    // Retrieve the chat container and input
    chatInput = document.getElementById('chat-input');
    chatContainer = document.getElementById('chat-container');

    // Remove the default behaviour of the UP key
    chatInput.addEventListener('keydown', function(event) {
        if(event.keyCode === 38) {
            event.preventDefault();
        }
    });
    (document.getElementsByTagName("body")[0]).addEventListener('keyup', function(event){
        switch (event.keyCode) {
            case 27:
                // ESCAPE key pressed
                chatInput.value = '';

            // Disable the chat input
            mp.events.call('toggleChatOpen', false);
            break;
        }
    });
    // Handle keys for the chat input
    chatInput.addEventListener('keyup', function(event) {
        switch(event.keyCode) {
            case 13:
                // ENTER key pressed
                if(chatInput.value.trim().length > 0) {
                    // Get the message on the input
                    let message = chatInput.value.trim();
                    chatInput.value = '';

                    if(previousMessages[bufferSize - 1] !== undefined) {
                        // The buffer is full, remove the first element
                        previousMessages.splice(0, 1);
                    }

                    // Store the message into the array
                    previousMessages.push(message);
                    chatInput.value = '';

                    // Send the message or command
                    if(message.startsWith('/')) {
                        // Remove the slash
                        message = message.substring(1);

                        if(message.length > 0) {
                            // Invoke the command
                            mp.invoke("command", message);
                        }
                    } else {
                        // Send the chat message
                        mp.invoke('chatMessage', message);
                    }
                }

                // Disable the chat input
                mp.events.call('toggleChatOpen', false);

                break;
            case 27:
                // ESCAPE key pressed
                chatInput.value = '';

                // Disable the chat input
                mp.events.call('toggleChatOpen', false);
                break;
            case 40:
                // UP ARROW key pressed
                if(previousMessages.length > 0) {

                    if(currentMessage === undefined || currentMessage === previousMessages.length - 1) {
                        currentMessage = 0;
                    } else {
                        currentMessage++;
                    }

                    // Show the message on the chat
                    chatInput.value = (previousMessages[currentMessage + 1] != undefined) ? previousMessages[currentMessage + 1]:"";
                }

                // Set the cursor on the last position
                chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);

                break;
            case 38:
                // DOWN ARROW key pressed
                if(previousMessages.length > 0) {

                    if(currentMessage === undefined || currentMessage === 0) {
                        currentMessage = previousMessages.length - 1;
                    } else {
                        currentMessage--;
                    }

                    // Show the message on the chat
                    chatInput.value = previousMessages[currentMessage];
                }

                // Set the cursor on the last position
                chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);

                break;
        }
    });
});

function printChatMessage(message) {
    // Check if the buffer is full
    if(chatContainer.childNodes.length === maxChatRows) {
        // Delete the oldest message
        chatContainer.removeChild(chatContainer.firstChild);
    }

    // Create the element
    let textElement = document.createElement('p');
    textElement.innerHTML = message;
    textElement.style.padding = '3px';
    textElement.style.paddingTop = "0";
    textElement.style.marginTop = "-5px";

    textElement.style.transform = "scaleX(-1)";

    // Add the element to the child nodes
    chatContainer.appendChild(textElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function clearChat() {
    // Remove all the messages from the chat
    while(chatContainer.firstChild) {
        // Delete each message
        chatContainer.removeChild(chatContainer.firstChild);
    }
}

function focusChat() {
    // Set the focus on the chat input
    chatContainer.classList.remove('disabled');
    chatInput.classList.remove('disabled');
    $("#hide-button").removeClass("no-display");
    $("#codes-hide-button").removeClass("no-display");
    chatInput.disabled = false;
    chatInput.focus();
    currentMessage = 0;
}

function disableChatInput() {
    // Disables the messages on the chat
    chatInput.disabled = true;
    chatContainer.classList.add('disabled');
    $("#hide-button").addClass("no-display");
    $("#codes-hide-button").addClass("no-display");
}
function showButtons(faction){
    var container = $("#buttons-container");
    container.empty();
    var commands = ["/me", "/do", "/ame", "/dp", "/pm"];
    if(faction == 2){ // FD
        commands = ["/me", "/ammanetta", "/perquisisci", "/chiamate", "/r"];
    } else if (faction == 7) { // SD
        commands = ["/me", "/rianima", "/megafono", "/chiamate", "/r"];
    }
    commands.forEach(command => {
        container.append("<button class='btn btn-success col-md-1' onclick='writeCommand(this)'>"+command+"</button>");
    });
    if(faction == 2 || faction == 7){
        $("#codes-hide-button").show()
    }else{
        $("#codes-hide-button").hide();
    }
}
function hideButtons(){
    var container = $("#buttons-container");
    container.empty();
}
function writeCommand(button){
    var input = $("#chat-input");
    var previousText = input.val();
    input.val(button.innerHTML + " " + previousText);
}
function showChat(status){
    if (status) {
        $("#chat-container").show();
        $("#hide-button").css("opacity",1);
        $("#chat-hidden").addClass("no-display");
        $("#hide-button").attr("onclick","showChat(0)");
    }else{
        $("#chat-container").hide();
        $("#hide-button").css("opacity", 0.6);
        $("#chat-hidden").removeClass("no-display");
        $("#hide-button").attr("onclick","showChat(1)");
        
    }
}
function showCodes(faction){
    if(codesToggled) return;
    $("#codes-container").show();
    if(faction == 7){
        $("#codes-sd").show();
        $("#codes-fd").hide();
        $("#codes-title").text("SD");
        $("#arrow-right").hide();
        $("#arrow-left").show();
    }else if(faction == 2){
        $("#codes-sd").hide();
        $("#codes-fd").show();
        $("#codes-title").text("FD");
        $("#arrow-right").show();
        $("#arrow-left").hide();
    }
}
function hideCodes(){
    $("#codes-container").hide();
}
function disableCodes() {
    codesToggled = !codesToggled;
    if (codesToggled){
        $("#codes-container").hide();
        $("#codes-hide-button").css("opacity", 0.6);
    }else{
        $("#codes-container").show();
        $("#codes-hide-button").css("opacity", 1);
    }
}