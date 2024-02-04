const socket = io();

let user;
const chatBox = document.getElementById("chatBox");
const messagesList = document.getElementById("messagesList");

Swal.fire({
  icon: "info",
  title: "Registrate Porfavor!",
  input: "text",
  text: "Escriba su nombre de usuario...",
  confirmButtonText: "Registrarse",
  inputValidator: (value) => {
  if(!value) {
    return !value && "Debes ingresar tu nombre de usuario para ingresar.";
  }
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
  customClass: {
    popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
    icon: "!text-blue-600 !border-blue-500",
    validationMessage:
      "!w-10/12 !m-auto !mt-4 !text-slate-200 !bg-slate-700/90 !rounded-2xl !border-2 !border-gray-600",
    actions: "...",
    confirmButton: "!bg-blue-600 !px-8",
  },
}).then((result) => {
  if(result.isConfirmed){
    user = result.value;
    socket.emit("user-auth", user);
    Swal.fire({
      icon: "success",
      title: `Bienvenido ${user}!`,
      confirmButtonText: "Gracias!",
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
        confirmButton: "!bg-blue-600 !px-8",
        timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
      },
    });
  }
});

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("add-message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("message_add", (message) => {
  if (message.timestamp !== undefined) {
    let addedMessage = document.createElement("div");
    addedMessage.classList.add(
      "flex",
      "flex-row",
      "text-slate-200",
      "w-10/12",
      "border",
      "rounded-lg",
      "shadow",
      "bg-gray-700/90",
      "border-gray-600",
      "my-4",
      "m-auto",
      "items-center",
      "reen"

    );
    addedMessage.setAttribute("id", message._id);
    addedMessage.innerHTML = `


  <div class="relative mx-3">
    <div class="relative w-10 h-10 overflow-hidden bg-gray-700 ring-2 ring-gray-400 rounded-full flex-shrink-0">
      <svg class="absolute w-12 h-12 text-gray-500 -left-1" fill="currentColor" viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd">
        </path>
      </svg>
    </div>
    <p style="font-size: 17px;margin-top:10px; color:yellow;" class="absolute top-0 left-0 w-full text-center text-xs text-white">${message.user}</p>
  </div>
  <div style="padding-left: 40px;border-left: solid 2px white;" class="ml-1 mr-4 text-justify text-slate-300">
    <p style="padding-top: 10px;">${message.message}</p>
    <br>
    <p style="color: orange;" class="text-xs text-slate-50">${message.timestamp}</p>
  </div>
  `;

    messagesList.appendChild(addedMessage);
  }
});

socket.on("user-connected", (data) => {
  Swal.fire({
    title: "New user authenticated",
    text: `${data} has joined the chat`,
    toast: true,
    position: "top-right",
    icon: "success",
    customClass: {
      popup: "!text-slate-200 !bg-slate-800/90 !rounded-3xl",
      confirmButton: "!bg-blue-600 !px-5",
      timerProgressBar: "!m-auto !h-1 !my-2 !bg-blue-600/90 !rounded-3xl",
    },
  });
});
