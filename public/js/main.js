const chatForm = document.getElementById('chat-form')
const chatMsg = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io();


// get username and room from url
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

// console.log({username,room})

//join chat room
socket.emit('joinChat',{username,room});    

//get room
socket.on("roomUsers",({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message',message => { 
    // console.log(message )
    outputMsg(message);
    chatMsg.scrollTop = chatMsg.scrollHeight;
})

// submit message
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault(); 
    const msg = e.target.elements.msg.value;
    socket.emit('chatMsg',msg)
    e.target.elements.msg.value = ''; 
    e.target.elements.msg.focus(); 
}) 

function outputMsg(msg){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}
// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
  }
  
  // Add users to DOM
  function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }
  //Prompt the user before leave chat room

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  }); 