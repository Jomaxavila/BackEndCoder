console.log("home está cargado");
const socket = io();
let user;
let  chatBox = document.getElementById("chatBox")


// Swal.fire({
//   title: "Bienvenido a nuestro chat",
//   input: "text",
//   text: "Ingresa tu nombre por favor",
//   inputvalidator:(value)=>{
//     return !value && "Se requiere un nombre para continuar"

//   },
//   allowOutsideClick:true,
 
// }).then(result=>{
//   user=result.value
// })

chatBox.addEventListener("keyup" ,evt=>{
    if (evt.key == "Enter"){
      if(chatBox.value.trim().length>0){
        socket.emit("message", {user:user,message:chatBox.value});
        chatBox.value="";
      }
    }
  })

  socket.on ('messagesLogs', data=>{
    let log = document.getElementById('messagesLogs');
    let messages = "";

    data.forEach(message => {
      messages=messages+ `${message.user} dice: ${message.message}</br>`
    });
    messagesLogs.innerHTML = messages
  })

  socket.on('newUserConnected',data=>{
    if(!user) return;
    Swal.fire({
        text: "Nuevo usuario conectado",
        toast:true,
        position: 'top-right'
         })
 });

