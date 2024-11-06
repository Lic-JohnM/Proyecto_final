const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server);
  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("addToCart", (data) => {
      console.log("Producto añadido al carrito:", data);
      // Emitir una respuesta de confirmación
      socket.emit("cartUpdated", { message: "Producto añadido con éxito" });
    });
  });
};
