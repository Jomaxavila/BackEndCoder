console.log("chat está cargado");
const socket = io();
let user;
let chatMessages = document.getElementById("chatBox"); // Cambiar el ID al correcto

Swal.fire({
  title: "Bienvenido a nuestro chat",
  input: "text",
  text: "Ingresa tu usuario por favor",
  inputvalidator: (value) => {
    return !value && "Se requiere un nombre para continuar";
  },
  allowOutsideClick: true,
}).then((result) => {
  user = result.value;
});

chatMessages.addEventListener("keyup", (evt) => { // Cambiar el nombre de la variable
  if (evt.key == "Enter") {
    if (chatMessages.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatMessages.value });
      chatMessages.value = "";
    }
  }
});

socket.on("messagesLogs", (data) => {
  let log = document.getElementById("messagesLogs");
  let messages = "";

  data.forEach((message) => {
    messages = messages + `${message.user} dice: ${message.message}</br>`;
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
