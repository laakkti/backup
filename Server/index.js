/**
 * Create WebSocket server.
 */

const WebSocket = require("ws");
const serverWs = new WebSocket.Server({
  port: 8080,
});

let sockets = [];

const generateId = () => {
  const maxId = Math.max(...sockets.map((item) => item.id), 0);

  return maxId + 1;
};

const getSocketById = (id) => {
  return sockets.find((item) => item.id === id);
};

/*for(item in serverWs){

  console.log("serverWs= "+item);
}*/

serverWs.on("connection", function (socket) {
  socket.id = generateId();
  console.log("sockets ID= " + socket.id);
  sockets.push(socket);

  for (let ind = 0; ind < sockets.length; ind++) {
    console.log("sockets item= " + sockets[ind].id);
  }

  /*
  for (let item in sockets) {
    console.log("sockets item= " + item.id);
  }
  */

  /*
   for(item in socket){
    console.log("socket item= "+item);
   }
   console.log("socket.id= "+socket.id);
   console.log("socket.url= "+socket.url);
   */

  //serverWs.clients.forEach((client) => {
  //§console.log("client.id= "+client.id);
  /*
    console.log("client= "+client);
    for(item in client){

      console.log("client-item= "+item);
    }
    */
  //});

  /*
  for(item in socket){

    console.log("# "+item);
  }

  console.log("socket= "+socket.url);
  console.log("id= "+socket.id);
  */

  console.log(`connected client`);

  // When you receive a message, send that message to every socket.
  socket.on("message", function (msg) {
    console.log("msg=" + msg);

    /*for(let item in msg){

  console.log("msg-item= "+item);
}*/

    let msgObj = JSON.parse(msg);
    console.log("msg.id= " + msgObj.id);
    console.log("msg.time= " + msgObj.time);

    let ind = 0;
    /*sockets.forEach((s) => {
      s.send(msg.toString());
      //console.log(s);
      console.log("# " + ind + "  " + s);
      ind++;
    });*/
    //console.log("xxxxxxxxxxxx "+JSON.stringify(sockets[0]))
    console.log("## " + socket.id + " ==> " + msg.toString());
    socket.send("## " + socket.id + " ==> " + msg.toString());

    if (msgObj.id > 0) {
      let socketById = getSocketById(msgObj.id);
      socketById.send("##  ==> " + msgObj.time.toString());
    }

    //socket.emit("#2# "+msg.toString());
    //socket.broadcast.emit("#3# "+msg.toString());
    /*
    for (let item in sockets[0]) {
      console.log("sockets[0]-item= " + item);
    }
    */
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on("close", function () {
    sockets = sockets.filter((s) => s.id !== socket.id);
  });
});
