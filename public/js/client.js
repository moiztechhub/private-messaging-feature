const socket = io(); // Connect to the server

// DOM elements
const messageInp = document.getElementById('messageInp');
const sendContainer = document.getElementById('send-container');
const container = document.querySelector('.container');
const userList = document.getElementById('users');

// Notification sound
const audio = new Audio('/audio/ting.mp3'); // Ensure the path is correct and the file exists

// Function to append messages to the chat container
const appendMessage = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', position);
    messageElement.textContent = message;
    container.appendChild(messageElement);
    container.scrollTop = container.scrollHeight; // Auto-scroll to the bottom
    if (position === 'left') audio.play(); // Play sound for incoming messages
};

// Prompt the user for their name
const username = prompt('Enter your name to join the chat:');
socket.emit('new-user', username); // Notify server of a new user

// Append a message when a user joins
socket.on('user-joined', (name) => {
    appendMessage(`${name} joined the chat`, 'left');
    audio.play(); // Play sound when a user joins
});

// Append received messages
socket.on('receive', (data) => {
    appendMessage(`${data.name}: ${data.message}`, 'left');
});

// Append a message when a user leaves
socket.on('user-left', (name) => {
    appendMessage(`${name} left the chat`, 'left');
    audio.play(); // Play sound when a user leaves
});

// Update the live user list
socket.on('update-users', (users) => {
    userList.innerHTML = ''; // Clear the existing list
    users.forEach((user) => {
        const userElement = document.createElement('li');
        userElement.textContent = user;
        userList.appendChild(userElement);
    });
});

// Send messages
sendContainer.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInp.value.trim(); // Remove extra spaces
    if (message !== '') {
        appendMessage(`You: ${message}`, 'right');
        socket.emit('send', message); // Notify server of the message
        messageInp.value = ''; // Clear input field
    }
});
