console.log("chat está cargado");
const socket = io();
let user;
let chatMessages = document.getElementById("chatMessages");

Swal.fire({
  title: "Bienvenido a nuestro chat",
  input: "text",
  text: "Ingresa un NICKNAME por favor",
  inputvalidator: (value) => {
    return !value && "Se requiere un nombre para continuar";
  },
  allowOutsideClick: true,
}).then((result) => {
  user = result.value;
});

chatMessages.addEventListener("keyup", (evt) => {
  if (evt.key == "Enter") {
    if (chatMessages.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatMessages.value });
      chatMessages.value = "";
    }
  }
});

socket.on("messagesLogs", (data) => {
  let messagesLogs = document.getElementById("messagesLogs");
  let messages = "";

  data.forEach((message) => {
    messages += `${message.user} dice: ${message.message}<br>`;
  });

  messagesLogs.innerHTML = messages;
});

socket.on("newUserConnected", (data) => {
  if (!user) return;
  Swal.fire({
    text: "Nuevo usuario conectado",
    toast: true,
    position: "top-right",
  });
});
