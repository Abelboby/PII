// Function to send data to server for storage
function saveData(text) {
    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Define the endpoint URL where your server-side code resides
    var url = '/saveData'; // Update this with your actual endpoint URL

    // Configure the request
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Define the data to be sent
    var data = JSON.stringify({ text: text });

    // Define a callback function to handle the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Data saved successfully!');
                // After saving data, wait for a few seconds before fetching messages
                setTimeout(fetchMessages, getRandomDelay()); // Get a random delay between 30 to 60 seconds
            } else {
                console.error('Error:', xhr.status);
            }
        }
    };

    // Send the request with the data
    xhr.send(data);
}


function fetchMessages() {
    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Define the endpoint URL for fetching and deleting messages
    var url = '/getAndDeleteMessages'; // Update this with your actual endpoint URL

    // Configure the request
    xhr.open('GET', url, true);

    // Define a callback function to handle the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Parse the response JSON
                var messages = JSON.parse(xhr.responseText);
                // Display the received messages
                displayMessages(messages);
            } else {
                console.error('Error:', xhr.status);
            }
        }
    };

    // Send the request
    xhr.send();
}

// Function to display messages in the chat box
function displayMessages(messages) {
    // Get the message box element
    var messageBox = document.getElementById('messages');
    
    // Clear the message box before displaying new messages
    messageBox.innerHTML = '';

    // Loop through each message and display it in the chat box
    messages.forEach(function(message) {
        
        var messageText = message.text.replace(/"""|````|''''/g, '');

        // Create a new message element
        var messageElement = document.createElement('div');
        messageElement.classList.add('message');

        // Replace newline characters with <br> tags
        var messageContent = messageText.replace(/\n/g, '<br>');

        // Set the message content
        messageElement.innerHTML = messageContent;

        // Append the new message to the message box
        messageBox.appendChild(messageElement);
    });
}



// Add event listener to the submit button
document.getElementById('submit-button').addEventListener('click', function () {
    var text = document.getElementById('message-input').value.trim(); // Get the input text
    if (text !== '') {
        // Display the message in the chat box
        displayMessage(text);

        // Clear the input box
        document.getElementById('message-input').value = '';

        // Call a function to send data to the server for storage (if needed)
        saveData(text);
    } else {
        console.error('Input text is empty!');
    }
});

// Function to display the message in the chat box
function displayMessage(text) {
    // Create a new message element
    var messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = text;

    // Append the new message to the message box
    var messageBox = document.getElementById('messages');
    messageBox.appendChild(messageElement);
}

// Function to generate a random delay between 30 to 60 seconds
function getRandomDelay() {
    return Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000; // Random delay between 30000ms (30s) to 60000ms (60s)
}

// Initial fetch of messages from MongoDB when the page loads
fetchMessages();
