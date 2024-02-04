// import __dirname from "../../utils.js";
// import fs from "fs";

// export default class MessagesManager {
//   constructor() {}

//   saveMessage = async (data) => {
//     const path = "./files/clientMsgs.json";
//     try {
//       const messages = await getMessages();
//       messages.push(JSON.parse(data));
//       await fs.promises.writeFile(path, JSON.stringify(messages, null, "\t"));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   getMessages = async (logMsgs) => {
//     const path = "../../files/clientMsgs.json";
//     const dir = "../../files";
//     try {
//       if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir);
//       }
//       if (fs.existsSync(path)) {
//         const clientMsgs = await fs.promises.readFile(path, "utf-8");
//         const size = new Blob([clientMsgs]).size;
//         if (size > 0) {
//           const parsedMsgs = JSON.parse(clientMsgs);
//           if (logMsgs === "log") {
//             console.log(parsedMsgs);
//           }
//           return parsedMsgs;
//         } else {
//           return [];
//         }
//       } else {
//         return [];
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
// }