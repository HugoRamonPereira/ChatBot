const closeTimes = document.getElementById('close-btn');
// const minimize = document.getElementById('minimize')
const botContainer = document.getElementById('container');
const msgInbox = document.getElementById('msgInbox');
const newMessage = document.getElementById('newMessage');
const chatInput = document.getElementById('msg-input');
const btnSendMsg = document.getElementById('sendMsg');
const modalMessage = document.getElementById('modal-container');
const modalBtnRight = document.getElementById('modalBtnR');
const modalBtnLeft = document.getElementById('modalBtnL');
const socket = io('http://localhost:3000');
let ID;


// Output Welcome Message to DOM
function outputMessage(message, option) {
    const newMsg = document.createElement("span");
    newMsg.className = option ? "msgRight" : "msgLeft";
    newMsg.innerText = `${message}`;
    document.querySelector('.msgInbox').appendChild(newMsg); 
    scrollToTop();
                                                        
    if (message === 'Welcome to our chatbot') {
        setTimeout(function secondMessage() {    
            const newMsg2 = document.createElement("span");
            newMsg2.className = option ? "msgRight" : "msgLeft";
            newMsg2.innerText = 'Please say something...';
            document.querySelector('.msgInbox').appendChild(newMsg2); 
        }, 1300);    
    }
}

socket.on('connect',  () => {
    ID = socket.id
    console.log(ID);
})
//socket.on is reaching out to server.js and accessing the message event and the message we assigned to it
socket.on('message', message => {
    outputMessage(message, true);
});


socket.on('receivedMessage', message => {
    if (ID !== message.ID) {
        outputMessage(message.message, false)
    }
})

// Close chat bot
closeTimes.addEventListener('click', () => {
    modalMessage.classList.add('appear');
});

//Minimize chatbot
// minimize.addEventListener('click', () => {
//     modalMessage.classList.remove('appear')
// }); 

// Click confirm clear all messages 
modalBtnRight.addEventListener('click', () => {
    modalMessage.classList.remove('appear');
    container.classList.add('hide');
});

// Click on the cancel button retain messages 
modalBtnLeft.addEventListener('click', () => {
    modalMessage.classList.remove('appear');
});

// Close modal with outside click
window.addEventListener('click', e => e.target == modalMessage ? modalMessage.classList.remove('appear') : false);

// Start new chat bot conversation
newMessage.addEventListener('click', () => {
    window.location.reload(true); 
});

// Send new message when click button and append next messages
btnSendMsg.addEventListener('click', () => {     
    if (chatInput.value !== '') {
        outputMessage(chatInput.value, true) 
        socket.emit('chatMessage', {message: chatInput.value, ID});
        chatInput.value = '';
        chatInput.focus();
        scrollToTop();
    } 
});

// Activate Enter to send message
chatInput.addEventListener('keydown', (enter) => {
    if (enter.keyCode === 13 && chatInput.value !== '') {

        outputMessage(chatInput.value, true) 


        // const sentMsg = chatInput.value
        // const newMsg = document.createElement("span");
        // newMsg.className = "msgRight";
        // newMsg.innerText = chatInput.value;
        // msgInbox.appendChild(newMsg);

        // const timeMsg = document.createElement("small");
        // timeMsg.className = "timeMssgR";
        // timeMsg.innerText = getCurrentTime();
        // msgInbox.appendChild(timeMsg);

        // Sends message to the backend
        socket.emit('chatMessage', {message: chatInput.value, ID});
        chatInput.value = '';
        chatInput.focus();
        scrollToTop();
    }
});


// Function to scroll to the bottom in case chat area starts to overflow
function scrollToTop() {
    msgInbox.scrollTop = msgInbox.scrollHeight;    
}

// Get current time 
function getCurrentTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    hours = hours < 10 ? '0'+ hours : hours; 
    minutes = minutes < 10 ? '0'+ minutes : minutes;

    curr_time = hours+':'+minutes;
    return curr_time;
}










