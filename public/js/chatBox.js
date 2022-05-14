const iframe = document.getElementById("message");
const iframeWindow = iframe.contentWindow;

const enableEditMode = () => {
  iframeWindow.document.designMode = "on";
  let body = iframeWindow.document.querySelector("body");
  body.style.color = "#929495";
  body.style.fontSize = "16px";
  body.style.lineHeight = "20px";
  body.innerHTML = "Chat goes here..";
};

const executeCommand = (command) => {
  iframeWindow.document.execCommand(command, false, null);
};

const executeCommandWithArguments = (command, arg) => {
  iframeWindow.document.execCommand(command, false, arg);
};
const insertEmoji = () => {
  let picker = new EmojiButton({ position: "top-start" });
  picker.showPicker(iframe);
  picker.on("emoji", (emoji) => {
    iframeWindow.document.execCommand("insertHTML", false, emoji);
  });
};
