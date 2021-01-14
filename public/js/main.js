const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Get username and room from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
// console.log(username , room);


const socket = io();

// Join Chatroom
socket.emit('joinRoom',{username, room});

// Get room and Users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// message from server (Node.js)
socket.on('message', message => { 
    //console.log(message);
    // let's print the message in the front end using DOMmanipulation.
    outputMessage(message);


    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // preventDefault function would stop the default thing. earlier it was submitting my input in the chat box and threfore the message typed in there vanishes but after adding it, The submission stops and is still visible.

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server. This is emiited by client and to be received by server side(Node.js)
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// DOM manipulation to print message in the front end // want to read how - https://www.w3schools.com/js/js_htmldom_nodes.asp
function outputMessage(message){
    const div = document.createElement('div'); 
    
    // create a message class in my div
    div.classList.add('message'); 

    div.innerHTML = (`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`);
    document.querySelector('.chat-messages').appendChild(div);

}

// Add roomname to dom
function outputRoomName(room) {
    roomName.innerText = room;
}

// d users to DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
