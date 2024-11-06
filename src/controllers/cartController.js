
const Cart = require("../models/Cart");
const Product = require("../models/Products"); // Asegúrate de importar el modelo de Product
const Counter = require("../models/Counter");

// Función para obtener el próximo valor de la secuencia
const getNextCartId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    "cartId", // Nombre único para la secuencia
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence_value;
};

// Controlador para crear un nuevo carrito
exports.createCart = async (req, res) => {
  try {
    const newId = await getNextCartId(); // Obtener el nuevo ID autoincrementado

    const newCart = new Cart({
      id: newId,
      products: req.body.products || [], // Productos proporcionados o un array vacío
    });

    await newCart.save();
    res.status(201).json({ success: true, cart: newCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Función para obtener todos los carritos
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find(); // Obtener todos los carritos
    res.status(200).json({ success: true, carts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Función para obtener un carrito por su ID
exports.getCartById = async (req, res) => {
  try {
    const { cid } = req.params; // Obtener el id del carrito desde los parámetros de la URL
    const cart = await Cart.findOne({ id: cid }); // Suponiendo que id es el campo que se autoincrementa

    if (!cart) {
      return res.status(404).json({ success: false, message: "Carrito no encontrado" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Eliminar un producto del carrito
exports.deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params; // Obtener los IDs desde los parámetros
    const cart = await Cart.findOne({ id: cid }); // Buscar el carrito por su ID

    if (!cart) {
      return res.status(404).json({ success: false, message: "Carrito no encontrado" });
    }

    // Filtrar el producto que queremos eliminar
    cart.products = cart.products.filter(product => product.productId != pid);
    await cart.save(); // Guardar los cambios en el carrito

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar todos los productos del carrito
exports.updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params; // Obtener el ID del carrito
    const { products } = req.body; // Obtener los nuevos productos desde el cuerpo de la solicitud

    const cart = await Cart.findOneAndUpdate(
      { id: cid },
      { products }, // Actualizar todos los productos
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ success: false, message: "Carrito no encontrado" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar solo la cantidad de un producto en el carrito
exports.updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params; // Obtener los IDs desde los parámetros
    const { quantity } = req.body; // Obtener la nueva cantidad desde el cuerpo de la solicitud

    const cart = await Cart.findOne({ id: cid }); // Buscar el carrito por su ID

    if (!cart) {
      return res.status(404).json({ success: false, message: "Carrito no encontrado" });
    }

    // Encontrar el producto y actualizar su cantidad
    const product = cart.products.find(p => p.productId == pid);
    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado en el carrito" });
    }

    product.quantity = quantity; // Actualizar la cantidad
    await cart.save(); // Guardar los cambios en el carrito

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar todos los productos del carrito
exports.deleteAllProductsFromCart = async (req, res) => {
  try {
    const { cid } = req.params; // Obtener el ID del carrito

    const cart = await Cart.findOneAndUpdate(
      { id: cid },
      { products: [] }, // Vaciar el array de productos
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ success: false, message: "Carrito no encontrado" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener todos los productos de un carrito con detalles
exports.getCartById = async (req, res) => {
  try {
    const { cid } = req.params; // Obtener el id del carrito desde los parámetros de la URL
    const cart = await Cart.findOne({ id: cid }).populate('products.productId'); // Suponiendo que 'productId' es la referencia al modelo de productos

    if (!cart) {
      return res.status(404).json({ success: false, message: "Carrito no encontrado" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


