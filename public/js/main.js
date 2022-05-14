const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const iframeBody = document
  .getElementById("message")
  .contentWindow.document.querySelector("body");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = iframeBody.innerHTML;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  iframeBody.innerHTML = "";
});

String.prototype.insert = function (index, string) {
  if (index > 0) {
    return this.substring(0, index) + string + this.substr(index);
  }

  return string + this;
};

// Output message to DOM
function outputMessage(message) {
  // Search message for username
  let newMessage;
  let mentionedFlag = false;
  message.text.split(" ").map((word, i) => {
    if (word.startsWith("@")) {
      // let username = word.substring(0);
      // if (username) {
      newMessage = message.text.replace(
        word,
        `<span class="mention">${word}</span>`
      );
      mentionedFlag = true;
      // }
    }
  });
  // Create message sender
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  if (mentionedFlag) {
    messageElement.innerHTML = `
    <p class="meta">
      ${message.username}
      <span>${message.time}</span>
    </p>
    <p class="text">${newMessage}</p>
    `;
  } else {
    messageElement.innerHTML = `
    <p class="meta">
      ${message.username}
      <span>${message.time}</span>
    </p>
    <p class="text">${message.text}</p>
    `;
  }
  // Append message to DOM
  document.querySelector(".chat-messages").appendChild(messageElement);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById("leave-button").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "../index.html";
  } else {
  }
});
