const socket = io();
socket.emit('message',"Hola Soy un cliente y me estoy comunicando desde un WS")

socket.on("evento_para_socket", data=>{
	console.log(data)
})


