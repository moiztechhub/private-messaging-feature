const socket = io(); // Automatically connects to the server's origin

// Get references to DOM elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Sound for notifications
var audio = new Audio('/audio/ting.mp3'); // Notification sound

// Append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === 'left') audio.play();
};

// Prompt for user name
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);



// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Listen for server events
socket.on('user-joined', name => append(`${name} joined the chat`, 'right'));
socket.on('receive', data => append(`${data.name}: ${data.message}`, 'left'));
socket.on('left', name => append(`${name} left the chat`, 'right'));
