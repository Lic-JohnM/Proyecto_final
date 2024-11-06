const express = require("express");
const path = require("path");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
const { engine } = require("express-handlebars");
const connectDB = require("./config/database");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const socketConfig = require("./socket");
const config = require("./config/config");

const app = express();

// Configuración de la base de datos
connectDB();

// Configuración de Handlebars
app.engine(
  "handlebars",
  engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: "main", // Cambia "main" si tu layout tiene otro nombre
    extname: ".handlebars",
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views")); // Asegúrate de que apunte a la carpeta correcta

// Middlewares
app.use(express.json());

// Rutas
app.use("/", productRoutes); // Renderiza la vista principal con Handlebars
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

// Iniciar el servidor
const server = app.listen(config.port, () => {
  console.log(`Servidor en el puerto ${config.port}`);
});

// Configuración de Socket.IO
socketConfig(server);
